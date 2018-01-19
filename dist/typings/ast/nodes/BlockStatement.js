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
var BlockScope_1 = require("../scopes/BlockScope");
var values_1 = require("../values");
var Statement_1 = require("./shared/Statement");
function isBlockStatement(node) {
    return node.type === "BlockStatement" /* BlockStatement */;
}
exports.isBlockStatement = isBlockStatement;
var BlockStatement = /** @class */ (function (_super) {
    __extends(BlockStatement, _super);
    function BlockStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlockStatement.prototype.bindImplicitReturnExpressionToScope = function () {
        var lastStatement = this.body[this.body.length - 1];
        if (!lastStatement || lastStatement.type !== "ReturnStatement" /* ReturnStatement */) {
            this.scope.addReturnExpression(values_1.UNKNOWN_EXPRESSION);
        }
    };
    BlockStatement.prototype.hasEffects = function (options) {
        return this.body.some(function (child) { return child.hasEffects(options); });
    };
    BlockStatement.prototype.includeInBundle = function () {
        var addedNewNodes = !this.included;
        this.included = true;
        this.body.forEach(function (node) {
            if (node.shouldBeIncluded()) {
                if (node.includeInBundle()) {
                    addedNewNodes = true;
                }
            }
        });
        return addedNewNodes;
    };
    BlockStatement.prototype.initialiseAndReplaceScope = function (scope) {
        this.scope = scope;
        this.initialiseNode(scope);
        this.initialiseChildren(scope);
    };
    BlockStatement.prototype.initialiseChildren = function (_parentScope) {
        var lastNode;
        for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
            var node = _a[_i];
            node.initialise(this.scope);
            if (lastNode)
                lastNode.next = node.start;
            lastNode = node;
        }
    };
    BlockStatement.prototype.initialiseScope = function (parentScope) {
        this.scope = new BlockScope_1.default({ parent: parentScope });
    };
    BlockStatement.prototype.render = function (code) {
        if (this.body.length) {
            for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                var node = _a[_i];
                node.render(code);
            }
        }
        else {
            _super.prototype.render.call(this, code);
        }
    };
    return BlockStatement;
}(Statement_1.StatementBase));
exports.default = BlockStatement;
