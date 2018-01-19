"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var values_1 = require("../values");
var Variable = /** @class */ (function () {
    function Variable(name) {
        this.name = name;
        this.safeName = null;
    }
    /**
     * Binds identifiers that reference this variable to this variable.
     * Necessary to be able to change variable names.
     */
    Variable.prototype.addReference = function (_identifier) { };
    Variable.prototype.reassignPath = function (_path, _options) { };
    Variable.prototype.forEachReturnExpressionWhenCalledAtPath = function (_path, _callOptions, _callback, _options) { };
    Variable.prototype.getName = function () {
        return this.safeName || this.name;
    };
    Variable.prototype.getValue = function () {
        return values_1.UNKNOWN_VALUE;
    };
    Variable.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 0;
    };
    Variable.prototype.hasEffectsWhenAssignedAtPath = function (_path, _options) {
        return true;
    };
    Variable.prototype.hasEffectsWhenCalledAtPath = function (_path, _callOptions, _options) {
        return true;
    };
    /**
     * Marks this variable as being part of the bundle, which is usually the case when one of
     * its identifiers becomes part of the bundle. Returns true if it has not been included
     * previously.
     * Once a variable is included, it should take care all its declarations are included.
     */
    Variable.prototype.includeVariable = function () {
        if (this.included) {
            return false;
        }
        this.included = true;
        return true;
    };
    Variable.prototype.someReturnExpressionWhenCalledAtPath = function (_path, _callOptions, predicateFunction, options) {
        return predicateFunction(options)(values_1.UNKNOWN_EXPRESSION);
    };
    Variable.prototype.toString = function () {
        return this.name;
    };
    Variable.prototype.setSafeName = function (name) {
        this.safeName = name;
    };
    return Variable;
}());
exports.default = Variable;
