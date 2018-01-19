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
var ParameterVariable = /** @class */ (function (_super) {
    __extends(ParameterVariable, _super);
    function ParameterVariable(identifier) {
        return _super.call(this, identifier.name, identifier) || this;
    }
    return ParameterVariable;
}(ReplaceableInitializationVariable_1.default));
exports.default = ParameterVariable;
