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
var ClassNode_1 = require("./shared/ClassNode");
var ClassDeclaration = /** @class */ (function (_super) {
    __extends(ClassDeclaration, _super);
    function ClassDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassDeclaration.prototype.initialiseChildren = function (parentScope) {
        // Class declarations are like let declarations: Not hoisted, can be reassigned, cannot be redeclared
        this.id && this.id.initialiseAndDeclare(parentScope, 'class', this);
        _super.prototype.initialiseChildren.call(this, parentScope);
    };
    ClassDeclaration.prototype.render = function (code) {
        if (!this.module.graph.treeshake || this.included) {
            _super.prototype.render.call(this, code);
        }
        else {
            code.remove(this.leadingCommentStart || this.start, this.next || this.end);
        }
    };
    return ClassDeclaration;
}(ClassNode_1.default));
exports.default = ClassDeclaration;
