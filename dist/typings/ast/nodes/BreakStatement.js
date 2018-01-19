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
var BreakStatement = /** @class */ (function (_super) {
    __extends(BreakStatement, _super);
    function BreakStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BreakStatement.prototype.hasEffects = function (options) {
        return (_super.prototype.hasEffects.call(this, options) ||
            !options.ignoreBreakStatements() ||
            (this.label && !options.ignoreLabel(this.label.name)));
    };
    return BreakStatement;
}(Statement_1.StatementBase));
exports.default = BreakStatement;
