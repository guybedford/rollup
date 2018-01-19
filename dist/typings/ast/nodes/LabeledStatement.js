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
var LabeledStatement = /** @class */ (function (_super) {
    __extends(LabeledStatement, _super);
    function LabeledStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LabeledStatement.prototype.hasEffects = function (options) {
        return this.body.hasEffects(options.setIgnoreLabel(this.label.name).setIgnoreBreakStatements());
    };
    return LabeledStatement;
}(Statement_1.StatementBase));
exports.default = LabeledStatement;
