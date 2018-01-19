"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getExportBlock(exports, dependencies, exportMode, mechanism) {
    if (mechanism === void 0) { mechanism = 'return'; }
    if (exportMode === 'default') {
        var local_1;
        exports.some(function (expt) {
            if (expt.exported === 'default') {
                local_1 = expt.local;
                return true;
            }
            return false;
        });
        // search for reexported default otherwise
        if (!local_1) {
            dependencies.some(function (dep) {
                if (!dep.reexports)
                    return false;
                return dep.reexports.some(function (expt) {
                    if (expt.reexported === 'default') {
                        local_1 = dep.name + "." + expt.imported;
                        return true;
                    }
                    return false;
                });
            });
        }
        return mechanism + " " + local_1 + ";";
    }
    var exportBlock = '';
    dependencies.forEach(function (_a) {
        var name = _a.name, reexports = _a.reexports;
        if (reexports && exportMode !== 'default') {
            if (exportBlock) {
                exportBlock += '\n';
            }
            reexports.forEach(function (specifier) {
                if (specifier.imported === '*') {
                    exportBlock += "Object.keys(" + name + ").forEach(function (key) { exports[key] = " + name + "[key]; });";
                }
                else {
                    exportBlock += "exports." + specifier.reexported + " = " + name + "." + specifier.imported + ";";
                }
            });
        }
    });
    exports.forEach(function (expt) {
        var lhs = "exports." + expt.exported;
        var rhs = expt.local;
        if (lhs === rhs) {
            return;
        }
        if (exportBlock) {
            exportBlock += '\n';
        }
        exportBlock += lhs + " = " + rhs + ";";
    });
    return exportBlock;
}
exports.default = getExportBlock;
