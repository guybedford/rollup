"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function es(chunk, magicString, _a) {
    var getPath = _a.getPath, intro = _a.intro, outro = _a.outro;
    var _b = chunk.getModuleDeclarations(), dependencies = _b.dependencies, exports = _b.exports;
    var importBlock = dependencies.map(function (_a) {
        var id = _a.id, reexports = _a.reexports, imports = _a.imports;
        if (!reexports && !imports) {
            return "import '" + getPath(id) + "';";
        }
        var output = '';
        if (imports) {
            var defaultImport_1 = imports.find(function (specifier) { return specifier.imported === 'default'; });
            var starImport = imports.find(function (specifier) { return specifier.imported === '*'; });
            if (starImport) {
                output += "import * as " + starImport.local + " from '" + getPath(id) + "';";
            }
            else if (defaultImport_1 && imports.length === 1) {
                output += "import " + defaultImport_1.local + " from '" + getPath(id) + "';";
            }
            else {
                output += "import " + (defaultImport_1 ? defaultImport_1.local + ", " : '') + "{ " + imports
                    .filter(function (specifier) { return specifier !== defaultImport_1; })
                    .map(function (specifier) {
                    if (specifier.imported === specifier.local) {
                        return specifier.imported;
                    }
                    else {
                        return specifier.imported + " as " + specifier.local;
                    }
                })
                    .join(', ') + " } from '" + getPath(id) + "';";
            }
        }
        if (reexports) {
            var starExport_1 = reexports.find(function (specifier) { return specifier.reexported[0] === '*'; });
            if (starExport_1) {
                output += "export * from '" + starExport_1.reexported.substr(1) + "';";
                if (reexports.length === 1) {
                    return output;
                }
                output += '\n';
            }
            output += "export { " + reexports
                .filter(function (specifier) { return specifier !== starExport_1; })
                .map(function (specifier) {
                if (specifier.imported === specifier.reexported) {
                    return specifier.imported;
                }
                else {
                    return specifier.imported + " as " + specifier.reexported;
                }
            })
                .join(', ') + " } from '" + getPath(id) + "';";
        }
        return output;
    }).join('\n');
    if (importBlock)
        intro += importBlock + '\n\n';
    if (intro)
        magicString.prepend(intro);
    var exportBlock = [];
    var exportDeclaration = [];
    exports.forEach(function (specifier) {
        if (specifier.exported === 'default') {
            exportBlock.push("export default " + specifier.local + ";");
        }
        else {
            exportDeclaration.push(specifier.exported === specifier.local ? specifier.local : specifier.local + " as " + specifier.exported);
        }
    });
    if (exportDeclaration.length) {
        exportBlock.push("export { " + exportDeclaration.join(', ') + " };");
    }
    if (exportBlock.length)
        magicString.append('\n\n' + exportBlock.join('\n').trim()); // TODO TypeScript: Awaiting PR
    if (outro)
        magicString.append(outro); // TODO TypeScript: Awaiting PR
    return magicString.trim(); // TODO TypeScript: Awaiting PR
}
exports.default = es;
