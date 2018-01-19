"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGlobalNameMaker(globals, chunk, fallback) {
    if (fallback === void 0) { fallback = null; }
    var fn = typeof globals === 'function' ? globals : function (id) { return globals[id]; };
    return function (module) {
        var name = fn(module.id);
        if (name)
            return name;
        if (Object.keys(module.declarations).length > 0) {
            chunk.graph.warn({
                code: 'MISSING_GLOBAL_NAME',
                source: module.id,
                guess: module.name,
                message: "No name was provided for external module '" + module.id + "' in options.globals \u2013 guessing '" + module.name + "'"
            });
            return module.name;
        }
        return fallback;
    };
}
exports.default = getGlobalNameMaker;
