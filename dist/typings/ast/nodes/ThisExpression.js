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
var ThisExpression = /** @class */ (function (_super) {
    __extends(ThisExpression, _super);
    function ThisExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThisExpression.prototype.initialiseNode = function () {
        var lexicalBoundary = this.scope.findLexicalBoundary();
        if (lexicalBoundary.isModuleScope) {
            this.alias = this.module.context;
            if (this.alias === 'undefined') {
                this.module.warn({
                    code: 'THIS_IS_UNDEFINED',
                    message: "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten",
                    url: "https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined"
                }, this.start);
            }
        }
    };
    ThisExpression.prototype.bindNode = function () {
        this.variable = this.scope.findVariable('this');
    };
    ThisExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (path.length > 0 &&
            this.variable.hasEffectsWhenAccessedAtPath(path, options));
    };
    ThisExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return this.variable.hasEffectsWhenAssignedAtPath(path, options);
    };
    ThisExpression.prototype.render = function (code) {
        if (this.alias) {
            code.overwrite(this.start, this.end, this.alias, {
                storeName: true,
                contentOnly: false
            });
        }
    };
    return ThisExpression;
}(Node_1.NodeBase));
exports.default = ThisExpression;
