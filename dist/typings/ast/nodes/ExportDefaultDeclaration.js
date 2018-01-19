"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./shared/Node");
var ExecutionPathOptions_1 = require("../ExecutionPathOptions");
var functionOrClassDeclaration = /^(?:Function|Class)Declaration/;
function buildRegexWithSpaces(re) {
    var spaceOrComment = '(?:' +
        [
            /\s/.source,
            /\/\/.*[\n\r]/.source,
            /\/\*[^]*?\*\//.source // Multiline comment. There is [^] instead of . because it also matches \n
        ].join('|') +
        ')';
    return new RegExp(re.source.replace(/\s|\\s/g, spaceOrComment), re.flags);
}
var sourceRE = {
    exportDefault: buildRegexWithSpaces(/^ *export +default */),
    declarationHeader: buildRegexWithSpaces(/^ *export +default +(?:(?:async +)?function(?: *\*)?|class)/)
};
var ExportDefaultDeclaration = /** @class */ (function (_super) {
    __extends(ExportDefaultDeclaration, _super);
    function ExportDefaultDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportDefaultDeclaration.prototype.bindNode = function () {
        if (this._declarationName) {
            this.variable.setOriginalVariable(this.scope.findVariable(this._declarationName));
        }
    };
    ExportDefaultDeclaration.prototype.includeDefaultExport = function () {
        this.included = true;
        this.declaration.includeInBundle();
    };
    ExportDefaultDeclaration.prototype.includeInBundle = function () {
        if (this.declaration.shouldBeIncluded()) {
            return this.declaration.includeInBundle();
        }
        return false;
    };
    ExportDefaultDeclaration.prototype.initialiseNode = function () {
        this.isExportDeclaration = true;
        this._declarationName =
            (this.declaration.id && this.declaration.id.name) ||
                this.declaration.name;
        this.variable = this.scope.addExportDefaultDeclaration(this._declarationName || this.module.basename(), this);
    };
    ExportDefaultDeclaration.prototype.render = function (code) {
        var _this = this;
        var remove = function () {
            code.remove(_this.leadingCommentStart || _this.start, _this.next || _this.end);
        };
        var removeExportDefault = function () {
            code.remove(_this.start, declaration_start);
        };
        var treeshakeable = this.module.graph.treeshake &&
            !this.included &&
            !this.declaration.included;
        var name = this.variable.getName();
        var statementStr = code.original.slice(this.start, this.end);
        // paren workaround: find first non-whitespace character position after `export default`
        var declaration_start = this.start + statementStr.match(sourceRE.exportDefault)[0].length;
        if (functionOrClassDeclaration.test(this.declaration.type)) {
            if (treeshakeable) {
                return remove();
            }
            // Add the id to anonymous declarations
            if (!this.declaration.id) {
                var id_insertPos = this.start + statementStr.match(sourceRE.declarationHeader)[0].length;
                code.appendLeft(id_insertPos, " " + name);
            }
            removeExportDefault();
        }
        else {
            if (treeshakeable) {
                var hasEffects = this.declaration.hasEffects(ExecutionPathOptions_1.default.create());
                return hasEffects ? removeExportDefault() : remove();
            }
            // Prevent `var foo = foo`
            if (this.variable.getOriginalVariableName() === name) {
                return remove();
            }
            // Only output `var foo =` if `foo` is used
            if (this.included) {
                code.overwrite(this.start, declaration_start, this.module.graph.varOrConst + " " + name + " = ");
            }
            else {
                removeExportDefault();
            }
        }
        _super.prototype.render.call(this, code);
    };
    return ExportDefaultDeclaration;
}(Node_1.NodeBase));
exports.default = ExportDefaultDeclaration;
