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
var Statement_1 = require("./shared/Statement");
var ForInStatement = /** @class */ (function (_super) {
    __extends(ForInStatement, _super);
    function ForInStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForInStatement.prototype.hasEffects = function (options) {
        return ((this.left &&
            (this.left.hasEffects(options) ||
                this.left.hasEffectsWhenAssignedAtPath([], options))) ||
            (this.right && this.right.hasEffects(options)) ||
            this.body.hasEffects(options.setIgnoreBreakStatements()));
    };
    ForInStatement.prototype.initialiseChildren = function () {
        this.left.initialise(this.scope);
        this.right.initialise(this.scope.parent);
        this.body.initialiseAndReplaceScope
            ? this.body.initialiseAndReplaceScope(this.scope)
            : this.body.initialise(this.scope);
    };
    ForInStatement.prototype.includeInBundle = function () {
        var addedNewNodes = _super.prototype.includeInBundle.call(this);
        if (this.left.includeWithAllDeclarations()) {
            addedNewNodes = true;
        }
        return addedNewNodes;
    };
    ForInStatement.prototype.initialiseScope = function (parentScope) {
        this.scope = new BlockScope_1.default({ parent: parentScope });
    };
    return ForInStatement;
}(Statement_1.StatementBase));
exports.default = ForInStatement;
