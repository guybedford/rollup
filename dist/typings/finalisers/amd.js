"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInteropBlock_1 = require("./shared/getInteropBlock");
var getExportBlock_1 = require("./shared/getExportBlock");
var esModuleExport_1 = require("./shared/esModuleExport");
var warnOnBuiltins_1 = require("./shared/warnOnBuiltins");
function amd(chunk, magicString, _a, options) {
    var exportMode = _a.exportMode, getPath = _a.getPath, indentString = _a.indentString, intro = _a.intro, outro = _a.outro;
    warnOnBuiltins_1.default(chunk);
    var _b = chunk.getModuleDeclarations(), dependencies = _b.dependencies, exports = _b.exports;
    var deps = dependencies.map(function (m) { return "'" + getPath(m.id) + "'"; });
    var args = dependencies.map(function (m) { return m.name; });
    if (exportMode === 'named') {
        args.unshift("exports");
        deps.unshift("'exports'");
    }
    var amdOptions = options.amd || {};
    var params = (amdOptions.id ? "'" + amdOptions.id + "', " : "") +
        (deps.length ? "[" + deps.join(', ') + "], " : "");
    var useStrict = options.strict !== false ? " 'use strict';" : "";
    var define = amdOptions.define || 'define';
    var wrapperStart = define + "(" + params + "function (" + args.join(', ') + ") {" + useStrict + "\n\n";
    // var foo__default = 'default' in foo ? foo['default'] : foo;
    var interopBlock = getInteropBlock_1.default(chunk, options);
    if (interopBlock)
        magicString.prepend(interopBlock + '\n\n');
    if (intro)
        magicString.prepend(intro);
    var exportBlock = getExportBlock_1.default(exports, dependencies, exportMode);
    if (exportBlock)
        magicString.append('\n\n' + exportBlock); // TODO TypeScript: Awaiting PR
    if (exportMode === 'named' && options.legacy !== true && chunk.isEntryModuleFacade)
        magicString.append("\n\n" + esModuleExport_1.default); // TODO TypeScript: Awaiting PR
    if (outro)
        magicString.append(outro);
    return magicString // TODO TypeScript: Awaiting PR
        .indent(indentString)
        .append('\n\n});')
        .prepend(wrapperStart);
}
exports.default = amd;
