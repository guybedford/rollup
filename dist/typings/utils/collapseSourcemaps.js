"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sourcemap_codec_1 = require("sourcemap-codec");
var error_1 = require("./error");
var path_1 = require("./path");
var Source = /** @class */ (function () {
    function Source(filename, content) {
        this.isOriginal = true;
        this.filename = filename;
        this.content = content;
    }
    Source.prototype.traceSegment = function (line, column, name) {
        return { line: line, column: column, name: name, source: this };
    };
    return Source;
}());
var Link = /** @class */ (function () {
    function Link(map, sources) {
        this.sources = sources;
        this.names = map.names;
        this.mappings = map.mappings;
    }
    Link.prototype.traceMappings = function () {
        var _this = this;
        var sources = [];
        var sourcesContent = [];
        var names = [];
        var mappings = this.mappings.map(function (line) {
            var tracedLine = [];
            line.forEach(function (segment) {
                var source = _this.sources[segment[1]];
                if (!source)
                    return;
                var traced = source.traceSegment(segment[2], segment[3], _this.names[segment[4]]);
                if (traced) {
                    var sourceIndex = null;
                    var nameIndex = null;
                    segment = [segment[0], null, traced.line, traced.column];
                    // newer sources are more likely to be used, so search backwards.
                    sourceIndex = sources.lastIndexOf(traced.source.filename);
                    if (sourceIndex === -1) {
                        sourceIndex = sources.length;
                        sources.push(traced.source.filename);
                        sourcesContent[sourceIndex] = traced.source.content;
                    }
                    else if (sourcesContent[sourceIndex] == null) {
                        sourcesContent[sourceIndex] = traced.source.content;
                    }
                    else if (traced.source.content != null &&
                        sourcesContent[sourceIndex] !== traced.source.content) {
                        error_1.default({
                            message: "Multiple conflicting contents for sourcemap source " + source.filename
                        });
                    }
                    segment[1] = sourceIndex;
                    if (traced.name) {
                        nameIndex = names.indexOf(traced.name);
                        if (nameIndex === -1) {
                            nameIndex = names.length;
                            names.push(traced.name);
                        }
                        segment[4] = nameIndex;
                    }
                    tracedLine.push(segment);
                }
            });
            return tracedLine;
        });
        return { sources: sources, sourcesContent: sourcesContent, names: names, mappings: mappings };
    };
    Link.prototype.traceSegment = function (line, column, name) {
        var segments = this.mappings[line];
        if (!segments)
            return null;
        for (var i = 0; i < segments.length; i += 1) {
            var segment = segments[i];
            if (segment[0] > column)
                return null;
            if (segment[0] === column) {
                var source = this.sources[segment[1]];
                if (!source)
                    return null;
                return source.traceSegment(segment[2], segment[3], this.names[segment[4]] || name);
            }
        }
        return null;
    };
    return Link;
}());
// TODO TypeScript: Fix <any> typecasts
function collapseSourcemaps(bundle, file, map, modules, bundleSourcemapChain) {
    var moduleSources = modules
        .filter(function (module) { return !module.excludeFromSourcemap; })
        .map(function (module) {
        var sourcemapChain = module.sourcemapChain;
        var source;
        if (!module.originalSourcemap) {
            source = new Source(module.id, module.originalCode);
        }
        else {
            var sources_1 = module.originalSourcemap.sources;
            var sourcesContent_1 = module.originalSourcemap.sourcesContent || [];
            if (sources_1 == null || (sources_1.length <= 1 && sources_1[0] == null)) {
                source = new Source(module.id, sourcesContent_1[0]);
                sourcemapChain = [module.originalSourcemap].concat(sourcemapChain);
            }
            else {
                // TODO indiscriminately treating IDs and sources as normal paths is probably bad.
                var directory_1 = path_1.dirname(module.id) || '.';
                var sourceRoot_1 = module.originalSourcemap.sourceRoot || '.';
                var baseSources = sources_1.map(function (source, i) {
                    return new Source(path_1.resolve(directory_1, sourceRoot_1, source), sourcesContent_1[i]);
                });
                source = new Link(module.originalSourcemap, baseSources);
            }
        }
        sourcemapChain.forEach(function (map) {
            if (map.missing) {
                bundle.graph.warn({
                    code: 'SOURCEMAP_BROKEN',
                    plugin: map.plugin,
                    message: "Sourcemap is likely to be incorrect: a plugin" + (map.plugin ? " ('" + map.plugin + "')" : "") + " was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help",
                    url: "https://github.com/rollup/rollup/wiki/Troubleshooting#sourcemap-is-likely-to-be-incorrect"
                });
                map = {
                    names: [],
                    mappings: ''
                };
            }
            source = new Link(map, [source]);
        });
        return source;
    });
    var source = new Link(map, moduleSources);
    bundleSourcemapChain.forEach(function (map) {
        source = new Link(map, [source]);
    });
    var _a = source.traceMappings(), sources = _a.sources, sourcesContent = _a.sourcesContent, names = _a.names, mappings = _a.mappings;
    if (file) {
        var directory_2 = path_1.dirname(file);
        sources = sources.map(function (source) { return path_1.relative(directory_2, source); });
        map.file = path_1.basename(file);
    }
    // we re-use the `map` object because it has convenient toString/toURL methods
    map.sources = sources;
    map.sourcesContent = sourcesContent;
    map.names = names;
    map.mappings = sourcemap_codec_1.encode(mappings);
    return map;
}
exports.default = collapseSourcemaps;
