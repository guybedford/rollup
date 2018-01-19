"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trimEmptyImports(modules) {
    var i = modules.length;
    while (i--) {
        var module_1 = modules[i];
        if (Object.keys(module_1.declarations).length > 0) {
            return modules.slice(0, i + 1);
        }
    }
    return [];
}
exports.default = trimEmptyImports;
