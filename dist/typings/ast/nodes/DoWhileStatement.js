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
var Statement_1 = require("./shared/Statement");
var DoWhileStatement = /** @class */ (function (_super) {
    __extends(DoWhileStatement, _super);
    function DoWhileStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoWhileStatement.prototype.hasEffects = function (options) {
        return (this.test.hasEffects(options) ||
            this.body.hasEffects(options.setIgnoreBreakStatements()));
    };
    return DoWhileStatement;
}(Statement_1.StatementBase));
exports.default = DoWhileStatement;
