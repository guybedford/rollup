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
var getParameterVariable = function (path, options) {
    var firstArgNum = parseInt(path[0], 10);
    return (firstArgNum < options.getArgumentsVariables().length &&
        options.getArgumentsVariables()[firstArgNum]) ||
        values_1.UNKNOWN_EXPRESSION;
};
var ArgumentsVariable = /** @class */ (function (_super) {
    __extends(ArgumentsVariable, _super);
    function ArgumentsVariable(parameters) {
        var _this = _super.call(this, 'arguments', null, values_1.UNKNOWN_EXPRESSION) || this;
        _this._parameters = parameters;
        return _this;
    }
    ArgumentsVariable.prototype.reassignPath = function (path, options) {
        var firstArgNum = parseInt(path[0], 10);
        if (path.length > 0) {
            if (firstArgNum >= 0 && this._parameters[firstArgNum]) {
                this._parameters[firstArgNum].reassignPath(path.slice(1), options);
            }
        }
    };
    ArgumentsVariable.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (path.length > 1 &&
            getParameterVariable(path, options).hasEffectsWhenAccessedAtPath(path.slice(1), options));
    };
    ArgumentsVariable.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length === 0 ||
            this.included ||
            getParameterVariable(path, options).hasEffectsWhenAssignedAtPath(path.slice(1), options));
    };
    ArgumentsVariable.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        if (path.length === 0) {
            return true;
        }
        return getParameterVariable(path, options).hasEffectsWhenCalledAtPath(path.slice(1), callOptions, options);
    };
    ArgumentsVariable.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        if (path.length === 0) {
            return true;
        }
        return getParameterVariable(path, options).someReturnExpressionWhenCalledAtPath(path.slice(1), callOptions, predicateFunction, options);
    };
    return ArgumentsVariable;
}(LocalVariable_1.default));
exports.default = ArgumentsVariable;
