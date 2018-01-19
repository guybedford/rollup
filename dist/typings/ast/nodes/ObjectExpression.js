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
var VariableReassignmentTracker_1 = require("../variables/VariableReassignmentTracker");
var values_1 = require("../values");
var Node_1 = require("./shared/Node");
var PROPERTY_KINDS_READ = ['init', 'get'];
var PROPERTY_KINDS_WRITE = ['init', 'set'];
exports.UNKNOWN_OBJECT_EXPRESSION = {
    reassignPath: function () { },
    forEachReturnExpressionWhenCalledAtPath: function () { },
    getValue: function () { return values_1.UNKNOWN_VALUE; },
    hasEffectsWhenAccessedAtPath: function (path) { return path.length > 1; },
    hasEffectsWhenAssignedAtPath: function (path) { return path.length > 1; },
    hasEffectsWhenCalledAtPath: function () { return true; },
    someReturnExpressionWhenCalledAtPath: function () { return true; },
    toString: function () { return '[[UNKNOWN OBJECT]]'; }
};
var ObjectExpression = /** @class */ (function (_super) {
    __extends(ObjectExpression, _super);
    function ObjectExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectExpression.prototype.reassignPath = function (path, options) {
        if (path.length === 0)
            return;
        var _a = this._getPossiblePropertiesWithName(path[0], path.length === 1 ? PROPERTY_KINDS_WRITE : PROPERTY_KINDS_READ), properties = _a.properties, hasCertainHit = _a.hasCertainHit;
        (path.length === 1 || hasCertainHit) &&
            properties.forEach(function (property) {
                return (path.length > 1 || property.kind === 'set') &&
                    property.reassignPath(path.slice(1), options);
            });
    };
    ObjectExpression.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        if (path.length === 0)
            return;
        var _a = this._getPossiblePropertiesWithName(path[0], PROPERTY_KINDS_READ), properties = _a.properties, hasCertainHit = _a.hasCertainHit;
        hasCertainHit &&
            properties.forEach(function (property) {
                return property.forEachReturnExpressionWhenCalledAtPath(path.slice(1), callOptions, callback, options);
            });
    };
    ObjectExpression.prototype._getPossiblePropertiesWithName = function (name, kinds) {
        if (name === VariableReassignmentTracker_1.UNKNOWN_KEY) {
            return { properties: this.properties, hasCertainHit: false };
        }
        var properties = [];
        var hasCertainHit = false;
        for (var index = this.properties.length - 1; index >= 0; index--) {
            var property = this.properties[index];
            if (kinds.indexOf(property.kind) < 0)
                continue;
            if (property.computed) {
                properties.push(property);
            }
            else if (property.key.name === name) {
                properties.push(property);
                hasCertainHit = true;
                break;
            }
        }
        return { properties: properties, hasCertainHit: hasCertainHit };
    };
    ObjectExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        if (path.length === 0)
            return false;
        var _a = this._getPossiblePropertiesWithName(path[0], PROPERTY_KINDS_READ), properties = _a.properties, hasCertainHit = _a.hasCertainHit;
        return ((path.length > 1 && !hasCertainHit) ||
            properties.some(function (property) {
                return property.hasEffectsWhenAccessedAtPath(path.slice(1), options);
            }));
    };
    ObjectExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        if (path.length === 0)
            return false;
        var _a = this._getPossiblePropertiesWithName(path[0], path.length === 1 ? PROPERTY_KINDS_WRITE : PROPERTY_KINDS_READ), properties = _a.properties, hasCertainHit = _a.hasCertainHit;
        return ((path.length > 1 && !hasCertainHit) ||
            properties.some(function (property) {
                return (path.length > 1 || property.kind === 'set') &&
                    property.hasEffectsWhenAssignedAtPath(path.slice(1), options);
            }));
    };
    ObjectExpression.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        if (path.length === 0)
            return true;
        var _a = this._getPossiblePropertiesWithName(path[0], PROPERTY_KINDS_READ), properties = _a.properties, hasCertainHit = _a.hasCertainHit;
        return (!hasCertainHit ||
            properties.some(function (property) {
                return property.hasEffectsWhenCalledAtPath(path.slice(1), callOptions, options);
            }));
    };
    ObjectExpression.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        if (path.length === 0)
            return true;
        var _a = this._getPossiblePropertiesWithName(path[0], PROPERTY_KINDS_READ), properties = _a.properties, hasCertainHit = _a.hasCertainHit;
        return (!hasCertainHit ||
            properties.some(function (property) {
                return property.someReturnExpressionWhenCalledAtPath(path.slice(1), callOptions, predicateFunction, options);
            }));
    };
    return ObjectExpression;
}(Node_1.NodeBase));
exports.default = ObjectExpression;
