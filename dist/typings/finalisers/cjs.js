"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var esModuleExport_1 = require("./shared/esModuleExport");
var getExportBlock_1 = require("./shared/getExportBlock");
function cjs(chunk, magicString, _a, options) {
    var exportMode = _a.exportMode, getPath = _a.getPath, intro = _a.intro, outro = _a.outro;
    intro =
        (options.strict === false ? intro : "'use strict';\n\n" + intro) +
            (exportMode === 'named' && options.legacy !== true && chunk.isEntryModuleFacade
                ? esModuleExport_1.default + "\n\n"
                : '');
    var needsInterop = false;
    var varOrConst = chunk.graph.varOrConst;
    var interop = options.interop !== false;
    var _b = chunk.getModuleDeclarations(), dependencies = _b.dependencies, exports = _b.exports;
    var importBlock = dependencies.map(function (_a) {
        var id = _a.id, isChunk = _a.isChunk, name = _a.name, reexports = _a.reexports, imports = _a.imports;
        if (!reexports && !imports) {
            return "require('" + getPath(id) + "');";
        }
        if (!interop || isChunk) {
            return varOrConst + " " + name + " = require('" + getPath(id) + "');";
        }
        var usesDefault = imports && imports.some(function (specifier) { return specifier.imported === 'default'; }) ||
            reexports && reexports.some(function (specifier) { return specifier.imported === 'default'; });
        if (!usesDefault) {
            return varOrConst + " " + name + " = require('" + getPath(id) + "');";
        }
        var exportsNamespace = imports && imports.some(function (specifier) { return specifier.imported === '*'; });
        if (exportsNamespace) {
            return varOrConst + " " + name + " = require('" + getPath(id) + "');" +
                ("\n" + varOrConst + " " + name + "__default = " + name + "['default'];");
        }
        needsInterop = true;
        var exportsNames = imports && imports.some(function (specifier) { return specifier.imported !== 'default' && specifier.imported !== '*'; }) ||
            reexports && reexports.some(function (specifier) { return specifier.imported === 'default'; });
        if (exportsNames) {
            return varOrConst + " " + name + " = require('" + getPath(id) + "');" +
                ("\n" + varOrConst + " " + name + "__default = _interopDefault(" + name + ");");
        }
        return varOrConst + " " + name + " = _interopDefault(require('" + getPath(id) + "'));";
    }).join('\n');
    if (needsInterop) {
        intro += "function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }\n\n";
    }
    if (importBlock) {
        intro += importBlock + '\n\n';
    }
    var exportBlock = getExportBlock_1.default(exports, dependencies, exportMode, 'module.exports =');
    magicString.prepend(intro);
    if (exportBlock)
        magicString.append('\n\n' + exportBlock); // TODO TypeScript: Awaiting PR
    if (outro)
        magicString.append(outro); // TODO TypeScript: Awaiting PR
    return magicString;
}
exports.default = cjs;
