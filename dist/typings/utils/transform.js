"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sourcemap_codec_1 = require("sourcemap-codec");
var locate_character_1 = require("locate-character");
var error_1 = require("./error");
var getCodeFrame_1 = require("./getCodeFrame");
function transform(graph, source, id, plugins) {
    var sourcemapChain = [];
    var originalSourcemap = typeof source.map === 'string' ? JSON.parse(source.map) : source.map;
    if (originalSourcemap && typeof originalSourcemap.mappings === 'string') {
        originalSourcemap.mappings = sourcemap_codec_1.decode(originalSourcemap.mappings);
    }
    var originalCode = source.code;
    var ast = source.ast;
    var promise = Promise.resolve(source.code);
    plugins.forEach(function (plugin) {
        if (!plugin.transform)
            return;
        promise = promise.then(function (previous) {
            function augment(object, pos, code) {
                var outObject = typeof object === 'string' ? { message: object } : object;
                if (outObject.code)
                    outObject.pluginCode = outObject.code;
                outObject.code = code;
                if (pos !== undefined) {
                    if (pos.line !== undefined && pos.column !== undefined) {
                        var line = pos.line, column = pos.column;
                        outObject.loc = { file: id, line: line, column: column };
                        outObject.frame = getCodeFrame_1.default(previous, line, column);
                    }
                    else {
                        outObject.pos = pos;
                        var _a = locate_character_1.locate(previous, pos, { offsetLine: 1 }), line = _a.line, column = _a.column;
                        outObject.loc = { file: id, line: line, column: column };
                        outObject.frame = getCodeFrame_1.default(previous, line, column);
                    }
                }
                outObject.plugin = plugin.name;
                outObject.id = id;
                return outObject;
            }
            var throwing;
            var context = {
                warn: function (warning, pos) {
                    warning = augment(warning, pos, 'PLUGIN_WARNING');
                    graph.warn(warning);
                },
                error: function (err, pos) {
                    err = augment(err, pos, 'PLUGIN_ERROR');
                    throwing = true;
                    error_1.default(err);
                }
            };
            var transformed;
            try {
                transformed = plugin.transform.call(context, previous, id);
            }
            catch (err) {
                if (!throwing)
                    context.error(err);
                error_1.default(err);
            }
            return Promise.resolve(transformed)
                .then(function (result) {
                if (result == null)
                    return previous;
                if (typeof result === 'string') {
                    result = {
                        code: result,
                        ast: undefined,
                        map: undefined
                    };
                }
                else if (typeof result.map === 'string') {
                    // `result.map` can only be a string if `result` isn't
                    result.map = JSON.parse(result.map);
                }
                if (result.map && typeof result.map.mappings === 'string') {
                    result.map.mappings = sourcemap_codec_1.decode(result.map.mappings);
                }
                // strict null check allows 'null' maps to not be pushed to the chain, while 'undefined' gets the missing map warning
                if (result.map !== null) {
                    sourcemapChain.push(result.map || { missing: true, plugin: plugin.name });
                }
                ast = result.ast;
                return result.code;
            })
                .catch(function (err) {
                err = augment(err, undefined, 'PLUGIN_ERROR');
                error_1.default(err);
            });
        });
    });
    return promise.then(function (code) { return ({
        code: code,
        originalCode: originalCode,
        originalSourcemap: originalSourcemap,
        ast: ast,
        sourcemapChain: sourcemapChain
    }); });
}
exports.default = transform;
