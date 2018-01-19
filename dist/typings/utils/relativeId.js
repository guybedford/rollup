"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("./path");
function relativeId(id) {
    if (typeof process === 'undefined' || !path_1.isAbsolute(id))
        return id;
    return path_1.relative(process.cwd(), id);
}
exports.default = relativeId;
