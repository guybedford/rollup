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
var ConditionalExpression = /** @class */ (function (_super) {
    __extends(ConditionalExpression, _super);
    function ConditionalExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionalExpression.prototype.reassignPath = function (path, options) {
        path.length > 0 &&
            this.forEachRelevantBranch(function (node) { return node.reassignPath(path, options); });
    };
    ConditionalExpression.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        this.forEachRelevantBranch(function (node) {
            return node.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, options);
        });
    };
    ConditionalExpression.prototype.getValue = function () {
        var testValue = this.test.getValue();
        if (testValue === values_1.UNKNOWN_VALUE)
            return values_1.UNKNOWN_VALUE;
        return testValue ? this.consequent.getValue() : this.alternate.getValue();
    };
    ConditionalExpression.prototype.hasEffects = function (options) {
        return (this.test.hasEffects(options) ||
            this.someRelevantBranch(function (node) { return node.hasEffects(options); }));
    };
    ConditionalExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (path.length > 0 &&
            this.someRelevantBranch(function (node) {
                return node.hasEffectsWhenAccessedAtPath(path, options);
            }));
    };
    ConditionalExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length === 0 ||
            this.someRelevantBranch(function (node) {
                return node.hasEffectsWhenAssignedAtPath(path, options);
            }));
    };
    ConditionalExpression.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        return this.someRelevantBranch(function (node) {
            return node.hasEffectsWhenCalledAtPath(path, callOptions, options);
        });
    };
    ConditionalExpression.prototype.initialiseChildren = function (parentScope) {
        _super.prototype.initialiseChildren.call(this, parentScope);
        if (this.module.graph.treeshake) {
            this.testValue = this.test.getValue();
            if (this.testValue === values_1.UNKNOWN_VALUE) {
                return;
            }
            else if (this.testValue) {
                this.alternate = null;
            }
            else if (this.alternate) {
                this.consequent = null;
            }
        }
    };
    ConditionalExpression.prototype.render = function (code) {
        if (!this.module.graph.treeshake) {
            _super.prototype.render.call(this, code);
        }
        else {
            if (this.testValue === values_1.UNKNOWN_VALUE) {
                _super.prototype.render.call(this, code);
            }
            else {
                var branchToRetain = this.testValue
                    ? this.consequent
                    : this.alternate;
                code.remove(this.start, branchToRetain.start);
                code.remove(branchToRetain.end, this.end);
                if (branchToRetain.type === "SequenceExpression" /* SequenceExpression */) {
                    code.prependLeft(branchToRetain.start, '(');
                    code.appendRight(branchToRetain.end, ')');
                }
                branchToRetain.render(code);
            }
        }
    };
    ConditionalExpression.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return this.someRelevantBranch(function (node) {
            return node.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, options);
        });
    };
    ConditionalExpression.prototype.forEachRelevantBranch = function (callback) {
        if (this.testValue === values_1.UNKNOWN_VALUE) {
            callback(this.consequent);
            callback(this.alternate);
        }
        else {
            this.testValue ? callback(this.consequent) : callback(this.alternate);
        }
    };
    ConditionalExpression.prototype.someRelevantBranch = function (predicateFunction) {
        return this.testValue === values_1.UNKNOWN_VALUE
            ? predicateFunction(this.consequent) || predicateFunction(this.alternate)
            : this.testValue
                ? predicateFunction(this.consequent)
                : predicateFunction(this.alternate);
    };
    return ConditionalExpression;
}(Node_1.NodeBase));
exports.default = ConditionalExpression;
