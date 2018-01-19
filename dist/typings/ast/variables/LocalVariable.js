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
var Variable_1 = require("./Variable");
var VariableReassignmentTracker_1 = require("./VariableReassignmentTracker");
// To avoid infinite recursions
var MAX_PATH_DEPTH = 7;
var LocalVariable = /** @class */ (function (_super) {
    __extends(LocalVariable, _super);
    function LocalVariable(name, declarator, init) {
        var _this = _super.call(this, name) || this;
        _this.isReassigned = false;
        _this.exportName = null;
        _this.declarations = new Set(declarator ? [declarator] : null);
        _this.boundExpressions = new VariableReassignmentTracker_1.default(init);
        return _this;
    }
    LocalVariable.prototype.addDeclaration = function (identifier) {
        this.declarations.add(identifier);
    };
    LocalVariable.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        if (path.length > MAX_PATH_DEPTH)
            return;
        this.boundExpressions.forEachAtPath(path, function (relativePath, node) {
            return !options.hasNodeBeenCalledAtPathWithOptions(relativePath, node, callOptions) &&
                node.forEachReturnExpressionWhenCalledAtPath(relativePath, callOptions, callback, options.addCalledNodeAtPathWithOptions(relativePath, node, callOptions));
        });
    };
    LocalVariable.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (path.length > MAX_PATH_DEPTH ||
            this.boundExpressions.someAtPath(path, function (relativePath, node) {
                return relativePath.length > 0 &&
                    !options.hasNodeBeenAccessedAtPath(relativePath, node) &&
                    node.hasEffectsWhenAccessedAtPath(relativePath, options.addAccessedNodeAtPath(relativePath, node));
            }));
    };
    LocalVariable.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (this.included ||
            path.length > MAX_PATH_DEPTH ||
            this.boundExpressions.someAtPath(path, function (relativePath, node) {
                return relativePath.length > 0 &&
                    !options.hasNodeBeenAssignedAtPath(relativePath, node) &&
                    node.hasEffectsWhenAssignedAtPath(relativePath, options.addAssignedNodeAtPath(relativePath, node));
            }));
    };
    LocalVariable.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        return (path.length > MAX_PATH_DEPTH ||
            (this.included && path.length > 0) ||
            this.boundExpressions.someAtPath(path, function (relativePath, node) {
                return !options.hasNodeBeenCalledAtPathWithOptions(relativePath, node, callOptions) &&
                    node.hasEffectsWhenCalledAtPath(relativePath, callOptions, options.addCalledNodeAtPathWithOptions(relativePath, node, callOptions));
            }));
    };
    LocalVariable.prototype.includeVariable = function () {
        if (!_super.prototype.includeVariable.call(this))
            return false;
        this.declarations.forEach(function (identifier) { return identifier.includeInBundle(); });
        return true;
    };
    LocalVariable.prototype.reassignPath = function (path, options) {
        if (path.length > MAX_PATH_DEPTH)
            return;
        if (path.length === 0) {
            this.isReassigned = true;
        }
        if (!options.hasNodeBeenAssignedAtPath(path, this)) {
            this.boundExpressions.reassignPath(path, options.addAssignedNodeAtPath(path, this));
        }
    };
    LocalVariable.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        return (path.length > MAX_PATH_DEPTH ||
            (this.included && path.length > 0) ||
            this.boundExpressions.someAtPath(path, function (relativePath, node) {
                return !options.hasNodeBeenCalledAtPathWithOptions(relativePath, node, callOptions) &&
                    node.someReturnExpressionWhenCalledAtPath(relativePath, callOptions, predicateFunction, options.addCalledNodeAtPathWithOptions(relativePath, node, callOptions));
            }));
    };
    return LocalVariable;
}(Variable_1.default));
exports.default = LocalVariable;
