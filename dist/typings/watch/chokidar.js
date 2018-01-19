"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var require_relative_1 = require("require-relative");
var chokidar;
try {
    chokidar = require_relative_1.default('chokidar', process.cwd());
}
catch (err) {
    chokidar = null;
}
exports.default = chokidar;
