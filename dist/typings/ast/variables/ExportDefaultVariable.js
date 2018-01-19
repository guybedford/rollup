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
var LocalVariable_1 = require("./LocalVariable");
var ExportDefaultVariable = /** @class */ (function (_super) {
    __extends(ExportDefaultVariable, _super);
    function ExportDefaultVariable(name, exportDefaultDeclaration) {
        var _this = _super.call(this, name, exportDefaultDeclaration, exportDefaultDeclaration.declaration) || this;
        _this.isDefault = true;
        _this.hasId = !!exportDefaultDeclaration.declaration.id;
        return _this;
    }
    ExportDefaultVariable.prototype.addReference = function (identifier) {
        this.name = identifier.name;
        if (this._original) {
            this._original.addReference(identifier);
        }
    };
    ExportDefaultVariable.prototype.getName = function () {
        if (this._original && !this._original.isReassigned) {
            return this._original.getName();
        }
        return this.safeName || this.name;
    };
    ExportDefaultVariable.prototype.getOriginalVariableName = function () {
        return this._original && this._original.getName();
    };
    ExportDefaultVariable.prototype.includeVariable = function () {
        if (!_super.prototype.includeVariable.call(this)) {
            return false;
        }
        this.declarations.forEach(function (declaration) {
            return declaration.includeDefaultExport();
        });
        return true;
    };
    ExportDefaultVariable.prototype.setOriginalVariable = function (original) {
        this._original = original;
    };
    return ExportDefaultVariable;
}(LocalVariable_1.default));
exports.default = ExportDefaultVariable;
