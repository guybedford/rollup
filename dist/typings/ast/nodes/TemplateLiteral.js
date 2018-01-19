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
function isTemplateLiteral(node) {
    return node.type === "TemplateLiteral" /* TemplateLiteral */;
}
exports.isTemplateLiteral = isTemplateLiteral;
var TemplateLiteral = /** @class */ (function (_super) {
    __extends(TemplateLiteral, _super);
    function TemplateLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemplateLiteral.prototype.render = function (code) {
        code.indentExclusionRanges.push([this.start, this.end]); // TODO TypeScript: Awaiting PR
        _super.prototype.render.call(this, code);
    };
    return TemplateLiteral;
}(Node_1.NodeBase));
exports.default = TemplateLiteral;
