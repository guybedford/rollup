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
var FunctionScope_1 = require("../../scopes/FunctionScope");
var Node_1 = require("./Node");
var FunctionNode = /** @class */ (function (_super) {
    __extends(FunctionNode, _super);
    function FunctionNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FunctionNode.prototype.bindNode = function () {
        this.body.bindImplicitReturnExpressionToScope();
    };
    FunctionNode.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        path.length === 0 &&
            this.scope.forEachReturnExpressionWhenCalled(callOptions, callback, options);
    };
    FunctionNode.prototype.hasEffects = function (options) {
        return this.id && this.id.hasEffects(options);
    };
    FunctionNode.prototype.hasEffectsWhenAccessedAtPath = function (path) {
        if (path.length <= 1) {
            return false;
        }
        if (path[0] === 'prototype') {
            return path.length > 2;
        }
        return true;
    };
    FunctionNode.prototype.hasEffectsWhenAssignedAtPath = function (path) {
        if (path.length <= 1) {
            return false;
        }
        if (path[0] === 'prototype') {
            return path.length > 2;
        }
        return true;
    };
    FunctionNode.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        if (path.length > 0) {
            return true;
        }
        var innerOptions = this.scope.getOptionsWhenCalledWith(callOptions, options);
        return (this.params.some(function (param) { return param.hasEffects(innerOptions); }) ||
            this.body.hasEffects(innerOptions));
    };
    FunctionNode.prototype.includeInBundle = function () {
        this.scope.variables.arguments.includeVariable();
        return _super.prototype.includeInBundle.call(this);
    };
    FunctionNode.prototype.initialiseScope = function (parentScope) {
        this.scope = new FunctionScope_1.default({ parent: parentScope });
    };
    FunctionNode.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return (path.length > 0 ||
            this.scope.someReturnExpressionWhenCalled(callOptions, predicateFunction, options));
    };
    return FunctionNode;
}(Node_1.NodeBase));
exports.default = FunctionNode;
