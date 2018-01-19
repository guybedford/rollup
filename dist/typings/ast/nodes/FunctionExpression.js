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
var FunctionNode_1 = require("./shared/FunctionNode");
var Scope_1 = require("../scopes/Scope");
var FunctionExpression = /** @class */ (function (_super) {
    __extends(FunctionExpression, _super);
    function FunctionExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FunctionExpression.prototype.initialiseChildren = function () {
        var _this = this;
        this.id && this.id.initialiseAndDeclare(this.scope, 'function', this);
        this.params.forEach(function (param) {
            return param.initialiseAndDeclare(_this.scope, 'parameter', null);
        });
        this.body.initialiseAndReplaceScope(new Scope_1.default({ parent: this.scope }));
    };
    return FunctionExpression;
}(FunctionNode_1.default));
exports.default = FunctionExpression;
