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
function isExternalVariable(variable) {
    return variable.isExternal;
}
exports.isExternalVariable = isExternalVariable;
var ExternalVariable = /** @class */ (function (_super) {
    __extends(ExternalVariable, _super);
    function ExternalVariable(module, name) {
        var _this = _super.call(this, name) || this;
        _this.module = module;
        _this.isExternal = true;
        _this.isNamespace = name === '*';
        return _this;
    }
    ExternalVariable.prototype.addReference = function (identifier) {
        if (this.name === 'default' || this.name === '*') {
            this.module.suggestName(identifier.name);
        }
    };
    ExternalVariable.prototype.includeVariable = function () {
        if (this.included) {
            return false;
        }
        this.included = true;
        this.module.used = true;
        return true;
    };
    return ExternalVariable;
}(Variable_1.default));
exports.default = ExternalVariable;
