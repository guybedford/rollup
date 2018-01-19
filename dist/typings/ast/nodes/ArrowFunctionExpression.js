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
var Scope_1 = require("../scopes/Scope");
var ReturnValueScope_1 = require("../scopes/ReturnValueScope");
var BlockStatement_1 = require("./BlockStatement");
var Node_1 = require("./shared/Node");
var ArrowFunctionExpression = /** @class */ (function (_super) {
    __extends(ArrowFunctionExpression, _super);
    function ArrowFunctionExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrowFunctionExpression.prototype.bindNode = function () {
        BlockStatement_1.isBlockStatement(this.body)
            ? this.body.bindImplicitReturnExpressionToScope()
            : this.scope.addReturnExpression(this.body);
    };
    ArrowFunctionExpression.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        path.length === 0
            && this.scope.forEachReturnExpressionWhenCalled(callOptions, callback, options);
    };
    ArrowFunctionExpression.prototype.hasEffects = function (_options) {
        return false;
    };
    ArrowFunctionExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 1;
    };
    ArrowFunctionExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, _options) {
        return path.length > 1;
    };
    ArrowFunctionExpression.prototype.hasEffectsWhenCalledAtPath = function (path, _callOptions, options) {
        if (path.length > 0) {
            return true;
        }
        return (this.params.some(function (param) { return param.hasEffects(options); }) ||
            this.body.hasEffects(options));
    };
    ArrowFunctionExpression.prototype.initialiseChildren = function () {
        var _this = this;
        this.params.forEach(function (param) {
            return param.initialiseAndDeclare(_this.scope, 'parameter', null);
        });
        if (this.body.initialiseAndReplaceScope) {
            this.body.initialiseAndReplaceScope(new Scope_1.default({ parent: this.scope }));
        }
        else {
            this.body.initialise(this.scope);
        }
    };
    ArrowFunctionExpression.prototype.initialiseScope = function (parentScope) {
        this.scope = new ReturnValueScope_1.default({ parent: parentScope });
    };
    ArrowFunctionExpression.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return (path.length > 0 ||
            this.scope.someReturnExpressionWhenCalled(callOptions, predicateFunction, options));
    };
    return ArrowFunctionExpression;
}(Node_1.NodeBase));
exports.default = ArrowFunctionExpression;
