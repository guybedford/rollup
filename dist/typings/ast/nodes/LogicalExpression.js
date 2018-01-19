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
var values_1 = require("../values");
var Node_1 = require("./shared/Node");
var LogicalExpression = /** @class */ (function (_super) {
    __extends(LogicalExpression, _super);
    function LogicalExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogicalExpression.prototype.reassignPath = function (path, options) {
        path.length > 0 &&
            this._forEachRelevantBranch(function (node) { return node.reassignPath(path, options); });
    };
    LogicalExpression.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        this._forEachRelevantBranch(function (node) {
            return node.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, options);
        });
    };
    LogicalExpression.prototype.getValue = function () {
        var leftValue = this.left.getValue();
        if (leftValue === values_1.UNKNOWN_VALUE)
            return values_1.UNKNOWN_VALUE;
        if ((leftValue && this.operator === '||') ||
            (!leftValue && this.operator === '&&')) {
            return leftValue;
        }
        return this.right.getValue();
    };
    LogicalExpression.prototype.hasEffects = function (options) {
        var leftValue = this.left.getValue();
        return (this.left.hasEffects(options) ||
            ((leftValue === values_1.UNKNOWN_VALUE ||
                (!leftValue && this.operator === '||') ||
                (leftValue && this.operator === '&&')) &&
                this.right.hasEffects(options)));
    };
    LogicalExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (path.length > 0 &&
            this._someRelevantBranch(function (node) {
                return node.hasEffectsWhenAccessedAtPath(path, options);
            }));
    };
    LogicalExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length === 0 ||
            this._someRelevantBranch(function (node) {
                return node.hasEffectsWhenAssignedAtPath(path, options);
            }));
    };
    LogicalExpression.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        return this._someRelevantBranch(function (node) {
            return node.hasEffectsWhenCalledAtPath(path, callOptions, options);
        });
    };
    LogicalExpression.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return this._someRelevantBranch(function (node) {
            return node.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, options);
        });
    };
    LogicalExpression.prototype._forEachRelevantBranch = function (callback) {
        var leftValue = this.left.getValue();
        if (leftValue === values_1.UNKNOWN_VALUE) {
            callback(this.left);
            callback(this.right);
        }
        else if ((leftValue && this.operator === '||') ||
            (!leftValue && this.operator === '&&')) {
            callback(this.left);
        }
        else {
            callback(this.right);
        }
    };
    LogicalExpression.prototype._someRelevantBranch = function (predicateFunction) {
        var leftValue = this.left.getValue();
        if (leftValue === values_1.UNKNOWN_VALUE) {
            return predicateFunction(this.left) || predicateFunction(this.right);
        }
        if ((leftValue && this.operator === '||') ||
            (!leftValue && this.operator === '&&')) {
            return predicateFunction(this.left);
        }
        return predicateFunction(this.right);
    };
    return LogicalExpression;
}(Node_1.NodeBase));
exports.default = LogicalExpression;
