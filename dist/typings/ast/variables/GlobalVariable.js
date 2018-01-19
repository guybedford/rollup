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
var Variable_1 = require("./Variable");
var pureFunctions_1 = require("../nodes/shared/pureFunctions");
function isGlobalVariable(variable) {
    return variable.isGlobal;
}
exports.isGlobalVariable = isGlobalVariable;
var GlobalVariable = /** @class */ (function (_super) {
    __extends(GlobalVariable, _super);
    function GlobalVariable(name) {
        var _this = _super.call(this, name) || this;
        _this.isExternal = true;
        _this.isGlobal = true;
        _this.isReassigned = false;
        _this.included = true;
        return _this;
    }
    GlobalVariable.prototype.hasEffectsWhenAccessedAtPath = function (path) {
        // path.length == 0 can also have an effect but we postpone this for now
        return (path.length > 0
            && !this.isPureFunctionMember(path)
            && !(this.name === 'Reflect' && path.length === 1));
    };
    GlobalVariable.prototype.hasEffectsWhenCalledAtPath = function (path) {
        return !pureFunctions_1.default[[this.name].concat(path).join('.')];
    };
    GlobalVariable.prototype.isPureFunctionMember = function (path) {
        return pureFunctions_1.default[[this.name].concat(path).join('.')]
            || (path.length >= 1 && pureFunctions_1.default[[this.name].concat(path.slice(0, -1)).join('.')])
            || (path.length >= 2 && pureFunctions_1.default[[this.name].concat(path.slice(0, -2)).join('.')] && path[path.length - 2] === 'prototype');
    };
    return GlobalVariable;
}(Variable_1.default));
exports.default = GlobalVariable;
