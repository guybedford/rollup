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
var EmptyStatement = /** @class */ (function (_super) {
    __extends(EmptyStatement, _super);
    function EmptyStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmptyStatement.prototype.render = function (code) {
        if (this.parent.type === "BlockStatement" /* BlockStatement */ ||
            this.parent.type === "Program" /* Program */) {
            code.remove(this.start, this.end);
        }
    };
    return EmptyStatement;
}(Statement_1.StatementBase));
exports.default = EmptyStatement;
