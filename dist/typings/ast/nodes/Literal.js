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
function isLiteral(node) {
    return node.type === "Literal" /* Literal */;
}
exports.isLiteral = isLiteral;
var Literal = /** @class */ (function (_super) {
    __extends(Literal, _super);
    function Literal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Literal.prototype.getValue = function () {
        return this.value;
    };
    Literal.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        if (this.value === null) {
            return path.length > 0;
        }
        return path.length > 1;
    };
    Literal.prototype.hasEffectsWhenAssignedAtPath = function (path, _options) {
        if (this.value === null) {
            return path.length > 0;
        }
        return path.length > 1;
    };
    Literal.prototype.render = function (code) {
        if (typeof this.value === 'string') {
            code.indentExclusionRanges.push([this.start + 1, this.end - 1]); // TODO TypeScript: Awaiting MagicString PR
        }
    };
    return Literal;
}(Node_1.NodeBase));
exports.default = Literal;
