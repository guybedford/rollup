"use strict";
/// <reference path="../typings/package.json.d.ts" />
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./rollup/index"));
__export(require("./watch/index"));
var index_1 = require("./rollup/index");
exports.rollup = index_1.default;
var index_2 = require("./watch/index");
exports.watch = index_2.default;
var package_json_1 = require("package.json");
exports.VERSION = package_json_1.version;
