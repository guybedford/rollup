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
var Scope_1 = require("../../scopes/Scope");
var Node_1 = require("./Node");
var ClassNode = /** @class */ (function (_super) {
    __extends(ClassNode, _super);
    function ClassNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassNode.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 1;
    };
    ClassNode.prototype.hasEffectsWhenAssignedAtPath = function (path, _options) {
        return path.length > 1;
    };
    ClassNode.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        return (this.body.hasEffectsWhenCalledAtPath(path, callOptions, options) ||
            (this.superClass &&
                this.superClass.hasEffectsWhenCalledAtPath(path, callOptions, options)));
    };
    ClassNode.prototype.initialiseChildren = function (_parentScope) {
        if (this.superClass) {
            this.superClass.initialise(this.scope);
        }
        this.body.initialise(this.scope);
    };
    ClassNode.prototype.initialiseScope = function (parentScope) {
        this.scope = new Scope_1.default({ parent: parentScope });
    };
    return ClassNode;
}(Node_1.NodeBase));
exports.default = ClassNode;
