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
var ParameterScope_1 = require("./ParameterScope");
var CatchScope = /** @class */ (function (_super) {
    __extends(CatchScope, _super);
    function CatchScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CatchScope.prototype.addDeclaration = function (identifier, options) {
        if (options === void 0) { options = {
            isHoisted: false
        }; }
        if (options.isHoisted) {
            return this.parent.addDeclaration(identifier, options);
        }
        else {
            return _super.prototype.addDeclaration.call(this, identifier, options);
        }
    };
    return CatchScope;
}(ParameterScope_1.default));
exports.default = CatchScope;
