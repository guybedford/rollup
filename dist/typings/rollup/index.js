"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flushTime_1 = require("../utils/flushTime");
var path_1 = require("../utils/path");
var fs_1 = require("../utils/fs");
var object_1 = require("../utils/object");
var promise_1 = require("../utils/promise");
var error_1 = require("../utils/error");
var sourceMappingURL_1 = require("../utils/sourceMappingURL");
var mergeOptions_1 = require("../utils/mergeOptions");
var Graph_1 = require("../Graph");
exports.VERSION = '<@VERSION@>';
function addDeprecations(deprecations, warn) {
    var message = "The following options have been renamed \u2014 please update your config: " + deprecations.map(function (option) { return option.old + " -> " + option.new; }).join(', ');
    warn({
        code: 'DEPRECATED_OPTIONS',
        message: message,
        deprecations: deprecations
    });
}
function checkInputOptions(options) {
    if (options.transform || options.load || options.resolveId || options.resolveExternal) {
        throw new Error('The `transform`, `load`, `resolveId` and `resolveExternal` options are deprecated in favour of a unified plugin API. See https://github.com/rollup/rollup/wiki/Plugins for details');
    }
}
function checkOutputOptions(options) {
    if (options.format === 'es6') {
        error_1.default({
            message: 'The `es6` output format is deprecated – use `es` instead',
            url: "https://rollupjs.org/#format-f-output-format-"
        });
    }
    if (!options.format) {
        error_1.default({
            message: "You must specify options.format, which can be one of 'amd', 'cjs', 'es', 'iife' or 'umd'",
            url: "https://rollupjs.org/#format-f-output-format-"
        });
    }
    if (options.moduleId) {
        if (options.amd)
            throw new Error('Cannot have both options.amd and options.moduleId');
    }
}
var throwAsyncGenerateError = {
    get: function () {
        throw new Error("bundle.generate(...) now returns a Promise instead of a { code, map } object");
    }
};
function rollup(rawInputOptions) {
    try {
        if (!rawInputOptions) {
            throw new Error('You must supply an options object to rollup');
        }
        var _a = mergeOptions_1.default({
            config: rawInputOptions,
            deprecateConfig: { input: true },
        }), inputOptions_1 = _a.inputOptions, deprecations = _a.deprecations, optionError = _a.optionError;
        if (optionError)
            inputOptions_1.onwarn({ message: optionError, code: 'UNKNOWN_OPTION' });
        if (deprecations.length)
            addDeprecations(deprecations, inputOptions_1.onwarn);
        checkInputOptions(inputOptions_1);
        var graph_1 = new Graph_1.default(inputOptions_1);
        flushTime_1.timeStart('--BUILD--');
        var codeSplitting = inputOptions_1.experimentalCodeSplitting;
        if (codeSplitting) {
            if (typeof inputOptions_1.input === 'string')
                inputOptions_1.input = [inputOptions_1.input];
        }
        else if (inputOptions_1.input instanceof Array && !codeSplitting) {
            error_1.default({
                code: 'INVALID_OPTION',
                message: 'Multiple inputs only supported when setting the experimentalCodeSplitting flag option.'
            });
        }
        if (!codeSplitting)
            return graph_1.buildSingle(inputOptions_1.input)
                .then(function (chunk) {
                flushTime_1.timeEnd('--BUILD--');
                function generate(rawOutputOptions) {
                    if (!rawOutputOptions) {
                        throw new Error('You must supply an options object');
                    }
                    // since deprecateOptions, adds the output properties
                    // to `inputOptions` so adding that lastly
                    var consolidatedOutputOptions = Object.assign({}, {
                        output: Object.assign({}, rawOutputOptions, rawOutputOptions.output, inputOptions_1.output)
                    });
                    var mergedOptions = mergeOptions_1.default({
                        // just for backward compatiblity to fallback on root
                        // if the option isn't present in `output`
                        config: consolidatedOutputOptions,
                        deprecateConfig: { output: true },
                    });
                    if (mergedOptions.optionError)
                        mergedOptions.inputOptions.onwarn({ message: mergedOptions.optionError, code: 'UNKNOWN_OPTION' });
                    // now outputOptions is an array, but rollup.rollup API doesn't support arrays
                    var outputOptions = mergedOptions.outputOptions[0];
                    var deprecations = mergedOptions.deprecations;
                    if (deprecations.length)
                        addDeprecations(deprecations, inputOptions_1.onwarn);
                    checkOutputOptions(outputOptions);
                    flushTime_1.timeStart('--GENERATE--');
                    var promise = Promise.resolve()
                        .then(function () { return chunk.render(outputOptions); })
                        .then(function (rendered) {
                        flushTime_1.timeEnd('--GENERATE--');
                        graph_1.plugins.forEach(function (plugin) {
                            if (plugin.ongenerate) {
                                plugin.ongenerate(object_1.assign({
                                    bundle: result
                                }, outputOptions), rendered);
                            }
                        });
                        flushTime_1.flushTime();
                        return rendered;
                    });
                    Object.defineProperty(promise, 'code', throwAsyncGenerateError);
                    Object.defineProperty(promise, 'map', throwAsyncGenerateError);
                    return promise;
                }
                var result = {
                    imports: chunk.getImportIds(),
                    exports: chunk.getExportNames(),
                    modules: chunk.getJsonModules(),
                    generate: generate,
                    write: function (outputOptions) {
                        if (!outputOptions || (!outputOptions.file && !outputOptions.dest)) {
                            error_1.default({
                                code: 'MISSING_OPTION',
                                message: 'You must specify output.file'
                            });
                        }
                        return generate(outputOptions).then(function (result) {
                            var file = outputOptions.file;
                            var code = result.code, map = result.map;
                            var promises = [];
                            if (outputOptions.sourcemap) {
                                var url = void 0;
                                if (outputOptions.sourcemap === 'inline') {
                                    url = map.toUrl();
                                }
                                else {
                                    url = path_1.basename(file) + ".map";
                                    promises.push(fs_1.writeFile(file + '.map', map.toString()));
                                }
                                code += "//# " + sourceMappingURL_1.SOURCEMAPPING_URL + "=" + url + "\n";
                            }
                            promises.push(fs_1.writeFile(file, code));
                            return Promise.all(promises).then(function () {
                                return promise_1.mapSequence(graph_1.plugins.filter(function (plugin) { return plugin.onwrite; }), function (plugin) {
                                    return Promise.resolve(plugin.onwrite(object_1.assign({
                                        bundle: result
                                    }, outputOptions), result));
                                });
                            })
                                .then(function () { });
                        });
                    }
                };
                return result;
            });
        return graph_1.buildChunks(inputOptions_1.input)
            .then(function (bundle) {
            var chunks = {};
            Object.keys(bundle).forEach(function (chunkName) {
                var chunk = bundle[chunkName];
                chunks[chunkName] = {
                    name: chunkName,
                    imports: chunk.getImportIds(),
                    exports: chunk.getExportNames(),
                    modules: chunk.getJsonModules()
                };
            });
            function generate(rawOutputOptions) {
                var outputOptions = getAndCheckOutputOptions(inputOptions_1, rawOutputOptions);
                if (outputOptions.format === 'umd' || outputOptions.format === 'iife') {
                    error_1.default({
                        code: 'INVALID_OPTION',
                        message: 'UMD and IIFE output formats are not supported with the experimentalCodeSplitting option.'
                    });
                }
                flushTime_1.timeStart('--GENERATE--');
                var generated = {};
                var promise = Promise.all(Object.keys(bundle).map(function (chunkName) {
                    var chunk = bundle[chunkName];
                    return chunk.render(outputOptions)
                        .then(function (rendered) {
                        flushTime_1.timeEnd('--GENERATE--');
                        graph_1.plugins.forEach(function (plugin) {
                            if (plugin.ongenerate) {
                                var bundle_1 = chunks[chunkName];
                                plugin.ongenerate(object_1.assign({ bundle: bundle_1 }, outputOptions), rendered);
                            }
                        });
                        flushTime_1.flushTime();
                        generated[chunkName] = rendered;
                    });
                }))
                    .then(function () {
                    return generated;
                });
                Object.defineProperty(promise, 'code', throwAsyncGenerateError);
                Object.defineProperty(promise, 'map', throwAsyncGenerateError);
                return promise;
            }
            return {
                chunks: chunks,
                generate: generate,
                write: function (outputOptions) {
                    if (!outputOptions || !outputOptions.dir) {
                        error_1.default({
                            code: 'MISSING_OPTION',
                            message: 'You must specify output.dir for multiple inputs'
                        });
                    }
                    return generate(outputOptions).then(function (result) {
                        var dir = outputOptions.dir;
                        return Promise.all(Object.keys(result).map(function (chunkName) {
                            var chunk = result[chunkName];
                            var code = chunk.code, map = chunk.map;
                            var promises = [];
                            if (outputOptions.sourcemap) {
                                var url = void 0;
                                if (outputOptions.sourcemap === 'inline') {
                                    url = map.toUrl();
                                }
                                else {
                                    url = chunkName + ".map";
                                    promises.push(fs_1.writeFile(dir + '/' + chunkName + '.map', map.toString()));
                                }
                                code += "//# " + sourceMappingURL_1.SOURCEMAPPING_URL + "=" + url + "\n";
                            }
                            promises.push(fs_1.writeFile(dir + '/' + chunkName, code));
                            return Promise.all(promises).then(function () {
                                return promise_1.mapSequence(graph_1.plugins.filter(function (plugin) { return plugin.onwrite; }), function (plugin) {
                                    return Promise.resolve(plugin.onwrite(object_1.assign({ bundle: chunk }, outputOptions), chunk));
                                });
                            })
                                .then(function () { });
                        }));
                    });
                }
            };
        });
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.default = rollup;
function getAndCheckOutputOptions(inputOptions, rawOutputOptions) {
    if (!rawOutputOptions) {
        throw new Error('You must supply an options object');
    }
    // since deprecateOptions, adds the output properties
    // to `inputOptions` so adding that lastly
    var consolidatedOutputOptions = Object.assign({}, {
        output: Object.assign({}, rawOutputOptions, rawOutputOptions.output, inputOptions.output)
    });
    var mergedOptions = mergeOptions_1.default({
        // just for backward compatiblity to fallback on root
        // if the option isn't present in `output`
        config: consolidatedOutputOptions,
        deprecateConfig: { output: true },
    });
    if (mergedOptions.optionError)
        throw new Error(mergedOptions.optionError);
    // now outputOptions is an array, but rollup.rollup API doesn't support arrays
    var outputOptions = mergedOptions.outputOptions[0];
    var deprecations = mergedOptions.deprecations;
    if (deprecations.length)
        addDeprecations(deprecations, inputOptions.onwarn);
    checkOutputOptions(outputOptions);
    return outputOptions;
}
