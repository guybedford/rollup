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
var GlobalVariable_1 = require("../variables/GlobalVariable");
var Scope_1 = require("./Scope");
var GlobalScope = /** @class */ (function (_super) {
    __extends(GlobalScope, _super);
    function GlobalScope() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalScope.prototype.findVariable = function (name) {
        if (!this.variables[name]) {
            this.variables[name] = new GlobalVariable_1.default(name);
        }
        return this.variables[name];
    };
    GlobalScope.prototype.deshadow = function (names, children) {
        if (children === void 0) { children = this.children; }
        _super.prototype.deshadow.call(this, names, children);
    };
    return GlobalScope;
}(Scope_1.default));
exports.default = GlobalScope;
