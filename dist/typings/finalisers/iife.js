"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("../utils/object");
var error_1 = require("../utils/error");
var getInteropBlock_1 = require("./shared/getInteropBlock");
var getExportBlock_1 = require("./shared/getExportBlock");
var getGlobalNameMaker_1 = require("./shared/getGlobalNameMaker");
var sanitize_1 = require("./shared/sanitize");
var warnOnBuiltins_1 = require("./shared/warnOnBuiltins");
var trimEmptyImports_1 = require("./shared/trimEmptyImports");
var setupNamespace_1 = require("./shared/setupNamespace");
var identifierHelpers_1 = require("../utils/identifierHelpers");
var thisProp = function (name) { return "this" + sanitize_1.keypath(name); };
function iife(chunk, magicString, _a, options) {
    var exportMode = _a.exportMode, indentString = _a.indentString, intro = _a.intro, outro = _a.outro;
    var globalNameMaker = getGlobalNameMaker_1.default(options.globals || object_1.blank(), chunk, 'null');
    var extend = options.extend, name = options.name;
    var isNamespaced = name && name.indexOf('.') !== -1;
    var possibleVariableAssignment = !extend && !isNamespaced;
    var moduleDeclarations = chunk.getModuleDeclarations();
    if (name && possibleVariableAssignment && !identifierHelpers_1.isLegal(name)) {
        error_1.default({
            code: 'ILLEGAL_IDENTIFIER_AS_NAME',
            message: "Given name (" + name + ") is not legal JS identifier. If you need this you can try --extend option"
        });
    }
    warnOnBuiltins_1.default(chunk);
    var external = trimEmptyImports_1.default(chunk.externalModules);
    var dependencies = external.map(globalNameMaker);
    var args = external.map(function (m) { return m.name; });
    if (exportMode !== 'none' && !name) {
        error_1.default({
            code: 'INVALID_OPTION',
            message: "You must supply options.name for IIFE bundles"
        });
    }
    if (extend) {
        dependencies.unshift("(" + thisProp(name) + " = " + thisProp(name) + " || {})");
        args.unshift('exports');
    }
    else if (exportMode === 'named') {
        dependencies.unshift('{}');
        args.unshift('exports');
    }
    var useStrict = options.strict !== false ? indentString + "'use strict';\n\n" : "";
    var wrapperIntro = "(function (" + args + ") {\n" + useStrict;
    if (exportMode !== 'none' && !extend) {
        wrapperIntro =
            (isNamespaced ? thisProp(name) : chunk.graph.varOrConst + " " + name) +
                (" = " + wrapperIntro);
    }
    if (isNamespaced) {
        wrapperIntro =
            setupNamespace_1.default(name, 'this', false, options.globals) + wrapperIntro;
    }
    var wrapperOutro = "\n\n}(" + dependencies + "));";
    if (!extend && exportMode === 'named') {
        wrapperOutro = "\n\n" + indentString + "return exports;" + wrapperOutro;
    }
    // var foo__default = 'default' in foo ? foo['default'] : foo;
    var interopBlock = getInteropBlock_1.default(chunk, options);
    if (interopBlock)
        magicString.prepend(interopBlock + '\n\n');
    if (intro)
        magicString.prepend(intro);
    var exportBlock = getExportBlock_1.default(moduleDeclarations.exports, moduleDeclarations.dependencies, exportMode);
    if (exportBlock)
        magicString.append('\n\n' + exportBlock); // TODO TypeScript: Awaiting PR
    if (outro)
        magicString.append(outro); // TODO TypeScript: Awaiting PR
    return magicString
        .indent(indentString) // TODO TypeScript: Awaiting PR
        .prepend(wrapperIntro)
        .append(wrapperOutro);
}
exports.default = iife;
