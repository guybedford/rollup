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
var Node_1 = require("./shared/Node");
var ExportAllDeclaration = /** @class */ (function (_super) {
    __extends(ExportAllDeclaration, _super);
    function ExportAllDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportAllDeclaration.prototype.initialiseNode = function () {
        this.isExportDeclaration = true;
    };
    ExportAllDeclaration.prototype.render = function (code) {
        code.remove(this.leadingCommentStart || this.start, this.next || this.end);
    };
    return ExportAllDeclaration;
}(Node_1.NodeBase));
exports.default = ExportAllDeclaration;
