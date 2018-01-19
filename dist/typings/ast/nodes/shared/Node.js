"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var locate_character_1 = require("locate-character");
var ExecutionPathOptions_1 = require("../../ExecutionPathOptions");
var values_1 = require("../../values");
var NodeBase = /** @class */ (function () {
    function NodeBase() {
        this.keys = [];
    }
    NodeBase.prototype.bind = function () {
        this.bindChildren();
        this.bindNode();
    };
    /**
     * Override to control on which children "bind" is called.
     */
    NodeBase.prototype.bindChildren = function () {
        this.eachChild(function (child) { return child.bind(); });
    };
    /**
     * Override this to bind assignments to variables and do any initialisations that
     * require the scopes to be populated with variables.
     */
    NodeBase.prototype.bindNode = function () { };
    NodeBase.prototype.eachChild = function (callback) {
        var _this = this;
        this.keys.forEach(function (key) {
            var value = _this[key];
            if (!value)
                return;
            if (Array.isArray(value)) {
                value.forEach(function (child) { return child && callback(child); });
            }
            else {
                callback(value);
            }
        });
    };
    NodeBase.prototype.forEachReturnExpressionWhenCalledAtPath = function (_path, _callOptions, _callback, _options) { };
    NodeBase.prototype.getValue = function () {
        return values_1.UNKNOWN_VALUE;
    };
    NodeBase.prototype.hasEffects = function (options) {
        return this.someChild(function (child) { return child.hasEffects(options); });
    };
    NodeBase.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 0;
    };
    NodeBase.prototype.hasEffectsWhenAssignedAtPath = function (_path, _options) {
        return true;
    };
    NodeBase.prototype.hasEffectsWhenCalledAtPath = function (_path, _callOptions, _options) {
        return true;
    };
    NodeBase.prototype.hasIncludedChild = function () {
        return (this.included || this.someChild(function (child) { return child.hasIncludedChild(); }));
    };
    NodeBase.prototype.includeInBundle = function () {
        var addedNewNodes = !this.included;
        this.included = true;
        this.eachChild(function (childNode) {
            if (childNode.includeInBundle()) {
                addedNewNodes = true;
            }
        });
        return addedNewNodes;
    };
    NodeBase.prototype.includeWithAllDeclarations = function () {
        return this.includeInBundle();
    };
    NodeBase.prototype.initialise = function (parentScope) {
        this.initialiseScope(parentScope);
        this.initialiseNode(parentScope);
        this.initialiseChildren(parentScope);
    };
    NodeBase.prototype.initialiseAndDeclare = function (_parentScope, _kind, _init) { };
    /**
     * Override to change how and with what scopes children are initialised
     */
    NodeBase.prototype.initialiseChildren = function (_parentScope) {
        var _this = this;
        this.eachChild(function (child) { return child.initialise(_this.scope); });
    };
    /**
     * Override to perform special initialisation steps after the scope is initialised
     */
    NodeBase.prototype.initialiseNode = function (_parentScope) { };
    /**
     * Override if this scope should receive a different scope than the parent scope.
     */
    NodeBase.prototype.initialiseScope = function (parentScope) {
        this.scope = parentScope;
    };
    NodeBase.prototype.insertSemicolon = function (code) {
        if (code.original[this.end - 1] !== ';') {
            code.appendLeft(this.end, ';');
        }
    };
    NodeBase.prototype.locate = function () {
        // useful for debugging
        var location = locate_character_1.locate(this.module.code, this.start, { offsetLine: 1 });
        location.file = this.module.id;
        location.toString = function () { return JSON.stringify(location); };
        return location;
    };
    NodeBase.prototype.reassignPath = function (_path, _options) { };
    NodeBase.prototype.render = function (code) {
        this.eachChild(function (child) { return child.render(code); });
    };
    NodeBase.prototype.shouldBeIncluded = function () {
        return (this.included ||
            this.hasEffects(ExecutionPathOptions_1.default.create()) ||
            this.hasIncludedChild());
    };
    NodeBase.prototype.someChild = function (callback) {
        var _this = this;
        return this.keys.some(function (key) {
            var value = _this[key];
            if (!value)
                return false;
            if (Array.isArray(value)) {
                return value.some(function (child) { return child && callback(child); });
            }
            return callback(value);
        });
    };
    NodeBase.prototype.someReturnExpressionWhenCalledAtPath = function (_path, _callOptions, predicateFunction, options) {
        return predicateFunction(options)(values_1.UNKNOWN_EXPRESSION);
    };
    NodeBase.prototype.toString = function () {
        return this.module.code.slice(this.start, this.end);
    };
    return NodeBase;
}());
exports.NodeBase = NodeBase;
