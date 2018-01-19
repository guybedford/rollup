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
var ClassExpression = /** @class */ (function (_super) {
    __extends(ClassExpression, _super);
    function ClassExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassExpression.prototype.initialiseChildren = function (parentScope) {
        this.id && this.id.initialiseAndDeclare(this.scope, 'class', this);
        _super.prototype.initialiseChildren.call(this, parentScope);
    };
    ClassExpression.prototype.reassignPath = function (_path, _options) { };
    return ClassExpression;
}(ClassNode_1.default));
exports.default = ClassExpression;
