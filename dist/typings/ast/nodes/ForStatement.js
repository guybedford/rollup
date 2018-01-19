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
var ForStatement = /** @class */ (function (_super) {
    __extends(ForStatement, _super);
    function ForStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForStatement.prototype.hasEffects = function (options) {
        return ((this.init && this.init.hasEffects(options)) ||
            (this.test && this.test.hasEffects(options)) ||
            (this.update && this.update.hasEffects(options)) ||
            this.body.hasEffects(options.setIgnoreBreakStatements()));
    };
    ForStatement.prototype.initialiseChildren = function () {
        if (this.init)
            this.init.initialise(this.scope);
        if (this.test)
            this.test.initialise(this.scope);
        if (this.update)
            this.update.initialise(this.scope);
        this.body.initialise(this.scope);
    };
    ForStatement.prototype.initialiseScope = function (parentScope) {
        this.scope = new BlockScope_1.default({ parent: parentScope });
    };
    return ForStatement;
}(Statement_1.StatementBase));
exports.default = ForStatement;
