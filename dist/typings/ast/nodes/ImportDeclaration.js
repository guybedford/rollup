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
var ImportDeclaration = /** @class */ (function (_super) {
    __extends(ImportDeclaration, _super);
    function ImportDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImportDeclaration.prototype.bindChildren = function () { };
    ImportDeclaration.prototype.initialiseNode = function () {
        this.isImportDeclaration = true;
    };
    ImportDeclaration.prototype.render = function (code) {
        code.remove(this.start, this.next || this.end);
    };
    return ImportDeclaration;
}(Node_1.NodeBase));
exports.default = ImportDeclaration;
