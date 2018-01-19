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
var operators = {
    '==': function (left, right) { return left == right; },
    '!=': function (left, right) { return left != right; },
    '===': function (left, right) { return left === right; },
    '!==': function (left, right) { return left !== right; },
    '<': function (left, right) { return left < right; },
    '<=': function (left, right) { return left <= right; },
    '>': function (left, right) { return left > right; },
    '>=': function (left, right) { return left >= right; },
    '<<': function (left, right) { return left << right; },
    '>>': function (left, right) { return left >> right; },
    '>>>': function (left, right) { return left >>> right; },
    '+': function (left, right) { return left + right; },
    '-': function (left, right) { return left - right; },
    '*': function (left, right) { return left * right; },
    '/': function (left, right) { return left / right; },
    '%': function (left, right) { return left % right; },
    '|': function (left, right) { return left | right; },
    '^': function (left, right) { return left ^ right; },
    '&': function (left, right) { return left & right; },
    '**': function (left, right) { return Math.pow(left, right); },
    in: function (left, right) { return left in right; },
    instanceof: function (left, right) { return left instanceof right; }
};
var BinaryExpression = /** @class */ (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BinaryExpression.prototype.getValue = function () {
        var leftValue = this.left.getValue();
        if (leftValue === values_1.UNKNOWN_VALUE)
            return values_1.UNKNOWN_VALUE;
        var rightValue = this.right.getValue();
        if (rightValue === values_1.UNKNOWN_VALUE)
            return values_1.UNKNOWN_VALUE;
        var operatorFn = operators[this.operator];
        if (!operatorFn)
            return values_1.UNKNOWN_VALUE;
        return operatorFn(leftValue, rightValue);
    };
    BinaryExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 1;
    };
    return BinaryExpression;
}(Node_1.NodeBase));
exports.default = BinaryExpression;
