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
var SwitchCase = /** @class */ (function (_super) {
    __extends(SwitchCase, _super);
    function SwitchCase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SwitchCase.prototype.includeInBundle = function () {
        var addedNewNodes = !this.included;
        this.included = true;
        if (this.test && this.test.includeInBundle()) {
            addedNewNodes = true;
        }
        this.consequent.forEach(function (node) {
            if (node.shouldBeIncluded()) {
                if (node.includeInBundle()) {
                    addedNewNodes = true;
                }
            }
        });
        return addedNewNodes;
    };
    return SwitchCase;
}(Node_1.NodeBase));
exports.default = SwitchCase;
