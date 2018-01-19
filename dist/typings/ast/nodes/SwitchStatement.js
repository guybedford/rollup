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
var SwitchStatement = /** @class */ (function (_super) {
    __extends(SwitchStatement, _super);
    function SwitchStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchStatement.prototype.hasEffects = function (options) {
        return _super.prototype.hasEffects.call(this, options.setIgnoreBreakStatements());
    };
    SwitchStatement.prototype.initialiseScope = function (parentScope) {
        this.scope = new BlockScope_1.default({ parent: parentScope });
    };
    return SwitchStatement;
}(Statement_1.StatementBase));
exports.default = SwitchStatement;
