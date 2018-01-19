"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sourcemap_codec_1 = require("sourcemap-codec");
var error_1 = require("./error");
function transformBundle(code, plugins, sourcemapChain, options) {
    return plugins.reduce(function (promise, plugin) {
        if (!plugin.transformBundle)
            return promise;
        return promise.then(function (code) {
            return Promise.resolve()
                .then(function () {
                return plugin.transformBundle(code, options);
            })
                .then(function (result) {
                if (result == null)
                    return code;
                if (typeof result === 'string') {
                    result = {
                        code: result,
                        map: undefined
                    };
                }
                var map = typeof result.map === 'string'
                    ? JSON.parse(result.map)
                    : result.map;
                if (map && typeof map.mappings === 'string') {
                    map.mappings = sourcemap_codec_1.decode(map.mappings);
                }
                // strict null check allows 'null' maps to not be pushed to the chain, while 'undefined' gets the missing map warning
                if (map !== null) {
                    sourcemapChain.push(map || { missing: true, plugin: plugin.name });
                }
                return result.code;
            })
                .catch(function (err) {
                error_1.default({
                    code: 'BAD_BUNDLE_TRANSFORMER',
                    message: "Error transforming bundle" + (plugin.name ? " with '" + plugin.name + "' plugin" : '') + ": " + err.message,
                    plugin: plugin.name
                });
            });
        });
    }, Promise.resolve(code));
}
exports.default = transformBundle;
