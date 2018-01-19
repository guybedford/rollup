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
var ReplaceableInitializationVariable_1 = require("./ReplaceableInitializationVariable");
var ThisVariable = /** @class */ (function (_super) {
    __extends(ThisVariable, _super);
    function ThisVariable() {
        return _super.call(this, 'this', null) || this;
    }
    return ThisVariable;
}(ReplaceableInitializationVariable_1.default));
exports.default = ThisVariable;
