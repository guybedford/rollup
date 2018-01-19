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
var values_1 = require("../values");
var ReplaceableInitializationVariable = /** @class */ (function (_super) {
    __extends(ReplaceableInitializationVariable, _super);
    function ReplaceableInitializationVariable(name, declarator) {
        return _super.call(this, name, declarator, null) || this;
    }
    ReplaceableInitializationVariable.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (this._getInit(options).hasEffectsWhenAccessedAtPath(path, options) ||
            _super.prototype.hasEffectsWhenAccessedAtPath.call(this, path, options));
    };
    ReplaceableInitializationVariable.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (this._getInit(options).hasEffectsWhenAssignedAtPath(path, options) ||
            _super.prototype.hasEffectsWhenAssignedAtPath.call(this, path, options));
    };
    ReplaceableInitializationVariable.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        return (this._getInit(options).hasEffectsWhenCalledAtPath(path, callOptions, options) || _super.prototype.hasEffectsWhenCalledAtPath.call(this, path, callOptions, options));
    };
    ReplaceableInitializationVariable.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return (this._getInit(options).someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, options) ||
            _super.prototype.someReturnExpressionWhenCalledAtPath.call(this, path, callOptions, predicateFunction, options));
    };
    ReplaceableInitializationVariable.prototype._getInit = function (options) {
        return options.getReplacedVariableInit(this) || values_1.UNKNOWN_EXPRESSION;
    };
    return ReplaceableInitializationVariable;
}(LocalVariable_1.default));
exports.default = ReplaceableInitializationVariable;
