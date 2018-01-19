"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInteropBlock(chunk, options) {
    return chunk.externalModules
        .map(function (module) {
        if (!module.declarations.default || options.interop === false)
            return null;
        if (module.exportsNamespace) {
            return chunk.graph.varOrConst + " " + module.name + "__default = " + module.name + "['default'];";
        }
        if (module.exportsNames) {
            return chunk.graph.varOrConst + " " + module.name + "__default = 'default' in " + module.name + " ? " + module.name + "['default'] : " + module.name + ";";
        }
        return module.name + " = " + module.name + " && " + module.name + ".hasOwnProperty('default') ? " + module.name + "['default'] : " + module.name + ";";
    })
        .filter(Boolean)
        .join('\n');
}
exports.default = getInteropBlock;
