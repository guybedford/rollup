"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("../utils/object");
var error_1 = require("../utils/error");
var getInteropBlock_1 = require("./shared/getInteropBlock");
var getExportBlock_1 = require("./shared/getExportBlock");
var getGlobalNameMaker_1 = require("./shared/getGlobalNameMaker");
var esModuleExport_1 = require("./shared/esModuleExport");
var sanitize_1 = require("./shared/sanitize");
var warnOnBuiltins_1 = require("./shared/warnOnBuiltins");
var trimEmptyImports_1 = require("./shared/trimEmptyImports");
var setupNamespace_1 = require("./shared/setupNamespace");
function globalProp(name) {
    if (!name)
        return 'null';
    return "global" + sanitize_1.keypath(name);
}
function safeAccess(name) {
    var parts = name.split('.');
    var acc = 'global';
    return parts.map(function (part) { return ((acc += sanitize_1.property(part)), acc); }).join(" && ");
}
var wrapperOutro = '\n\n})));';
function umd(chunk, magicString, _a, options) {
    var exportMode = _a.exportMode, indentString = _a.indentString, getPath = _a.getPath, intro = _a.intro, outro = _a.outro;
    if (exportMode !== 'none' && !options.name) {
        error_1.default({
            code: 'INVALID_OPTION',
            message: 'You must supply options.name for UMD bundles'
        });
    }
    warnOnBuiltins_1.default(chunk);
    var moduleDeclarations = chunk.getModuleDeclarations();
    var globalNameMaker = getGlobalNameMaker_1.default(options.globals || object_1.blank(), chunk);
    var amdDeps = chunk.externalModules.map(function (m) { return "'" + getPath(m.id) + "'"; });
    var cjsDeps = chunk.externalModules.map(function (m) { return "require('" + getPath(m.id) + "')"; });
    var trimmed = trimEmptyImports_1.default(chunk.externalModules);
    var globalDeps = trimmed.map(function (module) { return globalProp(globalNameMaker(module)); });
    var args = trimmed.map(function (m) { return m.name; });
    if (exportMode === 'named') {
        amdDeps.unshift("'exports'");
        cjsDeps.unshift("exports");
        globalDeps.unshift("(" + setupNamespace_1.default(options.name, 'global', true, options.globals) + " = " + (options.extend ? globalProp(options.name) + " || " : '') + "{})");
        args.unshift('exports');
    }
    var amdOptions = options.amd || {};
    var amdParams = (amdOptions.id ? "'" + amdOptions.id + "', " : "") +
        (amdDeps.length ? "[" + amdDeps.join(', ') + "], " : "");
    var define = amdOptions.define || 'define';
    var cjsExport = exportMode === 'default' ? "module.exports = " : "";
    var defaultExport = exportMode === 'default'
        ? setupNamespace_1.default(options.name, 'global', true, options.globals) + " = "
        : '';
    var useStrict = options.strict !== false ? " 'use strict';" : "";
    var globalExport;
    if (options.noConflict === true) {
        var factory = void 0;
        if (exportMode === 'default') {
            factory = "var exports = factory(" + globalDeps + ");";
        }
        else if (exportMode === 'named') {
            var module_1 = globalDeps.shift();
            factory = "var exports = " + module_1 + ";\n\t\t\t\tfactory(" + ['exports'].concat(globalDeps) + ");";
        }
        globalExport = "(function() {\n\t\t\t\tvar current = " + safeAccess(options.name) + ";\n\t\t\t\t" + factory + "\n\t\t\t\t" + globalProp(options.name) + " = exports;\n\t\t\t\texports.noConflict = function() { " + globalProp(options.name) + " = current; return exports; };\n\t\t\t})()";
    }
    else {
        globalExport = "(" + defaultExport + "factory(" + globalDeps + "))";
    }
    var wrapperIntro = ("(function (global, factory) {\n\t\t\ttypeof exports === 'object' && typeof module !== 'undefined' ? " + cjsExport + "factory(" + cjsDeps.join(', ') + ") :\n\t\t\ttypeof " + define + " === 'function' && " + define + ".amd ? " + define + "(" + amdParams + "factory) :\n\t\t\t" + globalExport + ";\n\t\t}(this, (function (" + args + ") {" + useStrict + "\n\n\t\t")
        .replace(/^\t\t/gm, '')
        .replace(/^\t/gm, indentString || '\t');
    // var foo__default = 'default' in foo ? foo['default'] : foo;
    var interopBlock = getInteropBlock_1.default(chunk, options);
    if (interopBlock)
        magicString.prepend(interopBlock + '\n\n');
    if (intro)
        magicString.prepend(intro);
    var exportBlock = getExportBlock_1.default(moduleDeclarations.exports, moduleDeclarations.dependencies, exportMode);
    if (exportBlock)
        magicString.append('\n\n' + exportBlock); // TODO TypeScript: Awaiting PR
    if (exportMode === 'named' && options.legacy !== true)
        magicString.append("\n\n" + esModuleExport_1.default); // TODO TypeScript: Awaiting PR
    if (outro)
        magicString.append(outro); // TODO TypeScript: Awaiting PR
    return magicString
        .trim() // TODO TypeScript: Awaiting PR
        .indent(indentString)
        .append(wrapperOutro)
        .prepend(wrapperIntro);
}
exports.default = umd;
