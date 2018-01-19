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
var Variable_1 = require("./Variable");
var object_1 = require("../../utils/object");
var identifierHelpers_1 = require("../../utils/identifierHelpers");
function isNamespaceVariable(variable) {
    return variable.isNamespace;
}
exports.isNamespaceVariable = isNamespaceVariable;
var NamespaceVariable = /** @class */ (function (_super) {
    __extends(NamespaceVariable, _super);
    function NamespaceVariable(module) {
        var _this = _super.call(this, module.basename()) || this;
        _this.isNamespace = true;
        _this.module = module;
        _this.needsNamespaceBlock = false;
        _this.originals = object_1.blank();
        module
            .getExports()
            .concat(module.getReexports())
            .forEach(function (name) {
            _this.originals[name] = module.traceExport(name);
        });
        return _this;
    }
    NamespaceVariable.prototype.addReference = function (identifier) {
        this.name = identifier.name;
    };
    NamespaceVariable.prototype.includeVariable = function () {
        if (!_super.prototype.includeVariable.call(this)) {
            return false;
        }
        this.needsNamespaceBlock = true;
        object_1.forOwn(this.originals, function (original) { return original.includeVariable(); });
        return true;
    };
    NamespaceVariable.prototype.renderBlock = function (legacy, freeze, indentString) {
        var _this = this;
        var members = object_1.keys(this.originals).map(function (name) {
            var original = _this.originals[name];
            if (original.isReassigned && !legacy) {
                return indentString + "get " + name + " () { return " + original.getName() + "; }";
            }
            if (legacy && ~identifierHelpers_1.reservedWords.indexOf(name))
                name = "'" + name + "'";
            return "" + indentString + name + ": " + original.getName();
        });
        var callee = freeze
            ? legacy ? "(Object.freeze || Object)" : "Object.freeze"
            : '';
        return this.module.graph.varOrConst + " " + this.getName() + " = " + callee + "({\n" + members.join(',\n') + "\n});\n\n";
    };
    return NamespaceVariable;
}(Variable_1.default));
exports.default = NamespaceVariable;
