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
var ArrayExpression = /** @class */ (function (_super) {
    __extends(ArrayExpression, _super);
    function ArrayExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayExpression.prototype.hasEffectsWhenAccessedAtPath = function (path) {
        return path.length > 1;
    };
    return ArrayExpression;
}(Node_1.NodeBase));
exports.default = ArrayExpression;
