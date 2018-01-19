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
var ExportNamedDeclaration = /** @class */ (function (_super) {
    __extends(ExportNamedDeclaration, _super);
    function ExportNamedDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExportNamedDeclaration.prototype.bindChildren = function () {
        // Do not bind specifiers
        if (this.declaration)
            this.declaration.bind();
    };
    ExportNamedDeclaration.prototype.hasEffects = function (options) {
        return this.declaration && this.declaration.hasEffects(options);
    };
    ExportNamedDeclaration.prototype.initialiseNode = function () {
        this.isExportDeclaration = true;
    };
    ExportNamedDeclaration.prototype.render = function (code) {
        if (this.declaration) {
            code.remove(this.start, this.declaration.start);
            this.declaration.render(code);
        }
        else {
            var start = this.leadingCommentStart || this.start;
            var end = this.next || this.end;
            code.remove(start, end);
        }
    };
    return ExportNamedDeclaration;
}(Node_1.NodeBase));
exports.default = ExportNamedDeclaration;
