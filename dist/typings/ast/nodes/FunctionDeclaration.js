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
var FunctionDeclaration = /** @class */ (function (_super) {
    __extends(FunctionDeclaration, _super);
    function FunctionDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FunctionDeclaration.prototype.initialiseChildren = function (parentScope) {
        var _this = this;
        this.id && this.id.initialiseAndDeclare(parentScope, 'function', this);
        this.params.forEach(function (param) {
            return param.initialiseAndDeclare(_this.scope, 'parameter', null);
        });
        this.body.initialiseAndReplaceScope(new Scope_1.default({ parent: this.scope }));
    };
    FunctionDeclaration.prototype.render = function (code) {
        if (!this.module.graph.treeshake || this.included) {
            _super.prototype.render.call(this, code);
        }
        else {
            code.remove(this.leadingCommentStart || this.start, this.next || this.end);
        }
    };
    return FunctionDeclaration;
}(FunctionNode_1.default));
exports.default = FunctionDeclaration;
