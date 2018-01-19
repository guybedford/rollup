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
var Node_1 = require("./Node");
var StatementBase = /** @class */ (function (_super) {
    __extends(StatementBase, _super);
    function StatementBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatementBase.prototype.render = function (code) {
        if (!this.module.graph.treeshake || this.included) {
            _super.prototype.render.call(this, code);
        }
        else {
            code.remove(this.leadingCommentStart || this.start, this.next || this.end);
        }
    };
    return StatementBase;
}(Node_1.NodeBase));
exports.StatementBase = StatementBase;
