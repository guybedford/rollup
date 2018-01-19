"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("./fs"); // eslint-disable-line
var path_1 = require("./path");
var object_1 = require("./object");
var error_1 = require("./error");
var relativeId_1 = require("./relativeId");
function load(id) {
    return fs_1.readFileSync(id, 'utf-8');
}
exports.load = load;
function findFile(file) {
    try {
        var stats = fs_1.lstatSync(file);
        if (stats.isSymbolicLink())
            return findFile(fs_1.realpathSync(file));
        if (stats.isFile()) {
            // check case
            var name_1 = path_1.basename(file);
            var files = fs_1.readdirSync(path_1.dirname(file));
            if (~files.indexOf(name_1))
                return file;
        }
    }
    catch (err) {
        // suppress
    }
}
function addJsExtensionIfNecessary(file) {
    return findFile(file) || findFile(file + '.js');
}
function resolveId(importee, importer) {
    if (typeof process === 'undefined') {
        error_1.default({
            code: 'MISSING_PROCESS',
            message: "It looks like you're using Rollup in a non-Node.js environment. This means you must supply a plugin with custom resolveId and load functions",
            url: 'https://github.com/rollup/rollup/wiki/Plugins'
        });
    }
    // external modules (non-entry modules that start with neither '.' or '/')
    // are skipped at this stage.
    if (importer !== undefined && !path_1.isAbsolute(importee) && importee[0] !== '.')
        return null;
    // `resolve` processes paths from right to left, prepending them until an
    // absolute path is created. Absolute importees therefore shortcircuit the
    // resolve call and require no special handing on our part.
    // See https://nodejs.org/api/path.html#path_path_resolve_paths
    return addJsExtensionIfNecessary(path_1.resolve(importer ? path_1.dirname(importer) : path_1.resolve(), importee));
}
exports.resolveId = resolveId;
function makeOnwarn() {
    var warned = object_1.blank();
    return function (warning) {
        var str = warning.toString();
        if (str in warned)
            return;
        console.error(str); //eslint-disable-line no-console
        warned[str] = true;
    };
}
exports.makeOnwarn = makeOnwarn;
function missingExport(module, name, otherModule, start) {
    module.error({
        code: 'MISSING_EXPORT',
        message: "'" + name + "' is not exported by " + relativeId_1.default(otherModule.id),
        url: "https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module"
    }, start);
}
exports.missingExport = missingExport;
