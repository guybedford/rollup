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
var Scope_1 = require("./Scope");
var ParameterVariable_1 = require("../variables/ParameterVariable");
var ParameterScope = /** @class */ (function (_super) {
    __extends(ParameterScope, _super);
    function ParameterScope(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this._parameters = [];
        return _this;
    }
    /**
     * Adds a parameter to this scope. Parameters must be added in the correct
     * order, e.g. from left to right.
     * @param {Identifier} identifier
     * @returns {Variable}
     */
    ParameterScope.prototype.addParameterDeclaration = function (identifier) {
        var variable = new ParameterVariable_1.default(identifier);
        this.variables[identifier.name] = variable;
        this._parameters.push(variable);
        return variable;
    };
    ParameterScope.prototype.getParameterVariables = function () {
        return this._parameters;
    };
    return ParameterScope;
}(Scope_1.default));
exports.default = ParameterScope;
