"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("./path");
__export(require("fs"));
function mkdirpath(path) {
    var dir = path_1.dirname(path);
    try {
        fs.readdirSync(dir);
    }
    catch (err) {
        mkdirpath(dir);
        try {
            fs.mkdirSync(dir);
        }
        catch (err2) {
            if (err2.code !== 'EEXIST') {
                throw err2;
            }
        }
    }
}
function writeFile(dest, data) {
    return new Promise(function (fulfil, reject) {
        mkdirpath(dest);
        fs.writeFile(dest, data, function (err) {
            if (err) {
                reject(err);
            }
            else {
                fulfil();
            }
        });
    });
}
exports.writeFile = writeFile;
