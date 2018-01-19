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
var ReturnValueScope_1 = require("./ReturnValueScope");
var ArgumentsVariable_1 = require("../variables/ArgumentsVariable");
var ThisVariable_1 = require("../variables/ThisVariable");
var ObjectExpression_1 = require("../nodes/ObjectExpression");
var values_1 = require("../values");
var FunctionScope = /** @class */ (function (_super) {
    __extends(FunctionScope, _super);
    function FunctionScope(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.variables.arguments = new ArgumentsVariable_1.default(_super.prototype.getParameterVariables.call(_this));
        _this.variables.this = new ThisVariable_1.default();
        return _this;
    }
    FunctionScope.prototype.findLexicalBoundary = function () {
        return this;
    };
    FunctionScope.prototype.getOptionsWhenCalledWith = function (_a, options) {
        var _this = this;
        var args = _a.args, withNew = _a.withNew;
        return options
            .replaceVariableInit(this.variables.this, withNew ? ObjectExpression_1.UNKNOWN_OBJECT_EXPRESSION : values_1.UNKNOWN_EXPRESSION)
            .setArgumentsVariables(args.map(function (parameter, index) { return _super.prototype.getParameterVariables.call(_this)[index] || parameter; }));
    };
    return FunctionScope;
}(ReturnValueScope_1.default));
exports.default = FunctionScope;
