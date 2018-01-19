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
var ExecutionPathOptions_1 = require("../ExecutionPathOptions");
var Node_1 = require("./shared/Node");
var operators = {
    '-': function (value) { return -value; },
    '+': function (value) { return +value; },
    '!': function (value) { return !value; },
    '~': function (value) { return ~value; },
    typeof: function (value) { return typeof value; },
    void: function () { return undefined; },
    delete: function () { return values_1.UNKNOWN_VALUE; }
};
var UnaryExpression = /** @class */ (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnaryExpression.prototype.bindNode = function () {
        if (this.operator === 'delete') {
            this.argument.reassignPath([], ExecutionPathOptions_1.default.create());
        }
    };
    UnaryExpression.prototype.getValue = function () {
        var argumentValue = this.argument.getValue();
        if (argumentValue === values_1.UNKNOWN_VALUE)
            return values_1.UNKNOWN_VALUE;
        return operators[this.operator](argumentValue);
    };
    UnaryExpression.prototype.hasEffects = function (options) {
        return (this.argument.hasEffects(options) ||
            (this.operator === 'delete' &&
                this.argument.hasEffectsWhenAssignedAtPath([], options)));
    };
    UnaryExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        if (this.operator === 'void') {
            return path.length > 0;
        }
        return path.length > 1;
    };
    UnaryExpression.prototype.initialiseNode = function () {
        this.value = this.getValue();
    };
    return UnaryExpression;
}(Node_1.NodeBase));
exports.default = UnaryExpression;
