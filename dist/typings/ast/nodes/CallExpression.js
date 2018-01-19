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
var CallOptions_1 = require("../CallOptions");
var GlobalVariable_1 = require("../variables/GlobalVariable");
var Identifier_1 = require("./Identifier");
var NamespaceVariable_1 = require("../variables/NamespaceVariable");
var Node_1 = require("./shared/Node");
var CallExpression = /** @class */ (function (_super) {
    __extends(CallExpression, _super);
    function CallExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CallExpression.prototype.reassignPath = function (path, options) {
        var _this = this;
        !options.hasReturnExpressionBeenAssignedAtPath(path, this) &&
            this.callee.forEachReturnExpressionWhenCalledAtPath([], this._callOptions, function (innerOptions) { return function (node) {
                return node.reassignPath(path, innerOptions.addAssignedReturnExpressionAtPath(path, _this));
            }; }, options);
    };
    CallExpression.prototype.bindNode = function () {
        if (Identifier_1.isIdentifier(this.callee)) {
            var variable = this.scope.findVariable(this.callee.name);
            if (NamespaceVariable_1.isNamespaceVariable(variable)) {
                this.module.error({
                    code: 'CANNOT_CALL_NAMESPACE',
                    message: "Cannot call a namespace ('" + this.callee.name + "')"
                }, this.start);
            }
            if (this.callee.name === 'eval' && GlobalVariable_1.isGlobalVariable(variable)) {
                this.module.warn({
                    code: 'EVAL',
                    message: "Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification",
                    url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval'
                }, this.start);
            }
        }
    };
    CallExpression.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        this.callee.forEachReturnExpressionWhenCalledAtPath([], this._callOptions, function (innerOptions) { return function (node) {
            return node.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, innerOptions);
        }; }, options);
    };
    CallExpression.prototype.hasEffects = function (options) {
        return (this.arguments.some(function (child) { return child.hasEffects(options); }) ||
            this.callee.hasEffectsWhenCalledAtPath([], this._callOptions, options.getHasEffectsWhenCalledOptions()));
    };
    CallExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        var _this = this;
        return (path.length > 0 &&
            !options.hasReturnExpressionBeenAccessedAtPath(path, this) &&
            this.callee.someReturnExpressionWhenCalledAtPath([], this._callOptions, function (innerOptions) { return function (node) {
                return node.hasEffectsWhenAccessedAtPath(path, innerOptions.addAccessedReturnExpressionAtPath(path, _this));
            }; }, options));
    };
    CallExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        var _this = this;
        return (!options.hasReturnExpressionBeenAssignedAtPath(path, this) &&
            this.callee.someReturnExpressionWhenCalledAtPath([], this._callOptions, function (innerOptions) { return function (node) {
                return node.hasEffectsWhenAssignedAtPath(path, innerOptions.addAssignedReturnExpressionAtPath(path, _this));
            }; }, options));
    };
    CallExpression.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        var _this = this;
        return (!options.hasReturnExpressionBeenCalledAtPath(path, this) &&
            this.callee.someReturnExpressionWhenCalledAtPath([], this._callOptions, function (innerOptions) { return function (node) {
                return node.hasEffectsWhenCalledAtPath(path, callOptions, innerOptions.addCalledReturnExpressionAtPath(path, _this));
            }; }, options));
    };
    CallExpression.prototype.initialiseNode = function () {
        this._callOptions = CallOptions_1.default.create({
            withNew: false,
            args: this.arguments,
            caller: this
        });
    };
    CallExpression.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return this.callee.someReturnExpressionWhenCalledAtPath([], this._callOptions, function (innerOptions) { return function (node) {
            return node.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, innerOptions);
        }; }, options);
    };
    return CallExpression;
}(Node_1.NodeBase));
exports.default = CallExpression;
