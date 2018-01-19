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
var SequenceExpression = /** @class */ (function (_super) {
    __extends(SequenceExpression, _super);
    function SequenceExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SequenceExpression.prototype.getValue = function () {
        return this.expressions[this.expressions.length - 1].getValue();
    };
    SequenceExpression.prototype.hasEffects = function (options) {
        return this.expressions.some(function (expression) { return expression.hasEffects(options); });
    };
    SequenceExpression.prototype.includeInBundle = function () {
        var addedNewNodes = !this.included;
        this.included = true;
        if (this.expressions[this.expressions.length - 1].includeInBundle()) {
            addedNewNodes = true;
        }
        this.expressions.forEach(function (node) {
            if (node.shouldBeIncluded()) {
                if (node.includeInBundle()) {
                    addedNewNodes = true;
                }
            }
        });
        return addedNewNodes;
    };
    SequenceExpression.prototype.render = function (code) {
        if (!this.module.graph.treeshake) {
            _super.prototype.render.call(this, code);
        }
        else {
            var last = this.expressions[this.expressions.length - 1];
            last.render(code);
            if (this.parent.type === "CallExpression" /* CallExpression */ &&
                last.type === "MemberExpression" /* MemberExpression */ &&
                this.expressions.length > 1) {
                this.expressions[0].included = true;
            }
            var included = this.expressions
                .slice(0, this.expressions.length - 1)
                .filter(function (expression) { return expression.included; });
            if (included.length === 0) {
                code.remove(this.start, last.start);
                code.remove(last.end, this.end);
            }
            else {
                var previousEnd = this.start;
                for (var _i = 0, included_1 = included; _i < included_1.length; _i++) {
                    var expression = included_1[_i];
                    expression.render(code);
                    code.remove(previousEnd, expression.start);
                    code.appendLeft(expression.end, ', ');
                    previousEnd = expression.end;
                }
                code.remove(previousEnd, last.start);
                code.remove(last.end, this.end);
            }
        }
    };
    return SequenceExpression;
}(Node_1.NodeBase));
exports.default = SequenceExpression;
