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
var ExpressionStatement = /** @class */ (function (_super) {
    __extends(ExpressionStatement, _super);
    function ExpressionStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpressionStatement.prototype.initialiseNode = function (_parentScope) {
        if (this.directive && this.directive !== 'use strict' && this.parent.type === "Program") {
            this.module.warn(// This is necessary, because either way (deleting or not) can lead to errors.
            {
                code: 'MODULE_LEVEL_DIRECTIVE',
                message: "Module level directives cause errors when bundled, '" + this.directive + "' was ignored."
            }, this.start);
        }
        return _super.prototype.initialiseNode.call(this, _parentScope);
    };
    ExpressionStatement.prototype.shouldBeIncluded = function () {
        if (this.directive && this.directive !== 'use strict')
            return this.parent.type !== "Program";
        return _super.prototype.shouldBeIncluded.call(this);
    };
    ExpressionStatement.prototype.render = function (code) {
        _super.prototype.render.call(this, code);
        if (this.included)
            this.insertSemicolon(code);
    };
    return ExpressionStatement;
}(Statement_1.StatementBase));
exports.default = ExpressionStatement;
