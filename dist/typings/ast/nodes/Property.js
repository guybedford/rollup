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
var CallOptions_1 = require("../CallOptions");
var values_1 = require("../values");
function isProperty(node) {
    return node.type === "Property" /* Property */;
}
exports.isProperty = isProperty;
var Property = /** @class */ (function (_super) {
    __extends(Property, _super);
    function Property() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Property.prototype.reassignPath = function (path, options) {
        var _this = this;
        if (this.kind === 'get') {
            path.length > 0 &&
                this.value.forEachReturnExpressionWhenCalledAtPath([], this._accessorCallOptions, function (innerOptions) { return function (node) {
                    return node.reassignPath(path, innerOptions.addAssignedReturnExpressionAtPath(path, _this));
                }; }, options);
        }
        else if (this.kind !== 'set') {
            this.value.reassignPath(path, options);
        }
    };
    Property.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        if (this.kind === 'get') {
            this.value.forEachReturnExpressionWhenCalledAtPath([], this._accessorCallOptions, function (innerOptions) { return function (node) {
                return node.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, innerOptions);
            }; }, options);
        }
        else {
            this.value.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, options);
        }
    };
    Property.prototype.hasEffects = function (options) {
        return this.key.hasEffects(options) || this.value.hasEffects(options);
    };
    Property.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        var _this = this;
        if (this.kind === 'get') {
            return (this.value.hasEffectsWhenCalledAtPath([], this._accessorCallOptions, options.getHasEffectsWhenCalledOptions()) ||
                (!options.hasReturnExpressionBeenAccessedAtPath(path, this) &&
                    this.value.someReturnExpressionWhenCalledAtPath([], this._accessorCallOptions, function (innerOptions) { return function (node) {
                        return node.hasEffectsWhenAccessedAtPath(path, innerOptions.addAccessedReturnExpressionAtPath(path, _this));
                    }; }, options)));
        }
        return this.value.hasEffectsWhenAccessedAtPath(path, options);
    };
    Property.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        var _this = this;
        if (this.kind === 'get') {
            return (path.length === 0 ||
                this.value.someReturnExpressionWhenCalledAtPath([], this._accessorCallOptions, function (innerOptions) { return function (node) {
                    return node.hasEffectsWhenAssignedAtPath(path, innerOptions.addAssignedReturnExpressionAtPath(path, _this));
                }; }, options));
        }
        if (this.kind === 'set') {
            return (path.length > 0 ||
                this.value.hasEffectsWhenCalledAtPath([], this._accessorCallOptions, options.getHasEffectsWhenCalledOptions()));
        }
        return this.value.hasEffectsWhenAssignedAtPath(path, options);
    };
    Property.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        var _this = this;
        if (this.kind === 'get') {
            return (this.value.hasEffectsWhenCalledAtPath([], this._accessorCallOptions, options.getHasEffectsWhenCalledOptions()) ||
                (!options.hasReturnExpressionBeenCalledAtPath(path, this) &&
                    this.value.someReturnExpressionWhenCalledAtPath([], this._accessorCallOptions, function (innerOptions) { return function (node) {
                        return node.hasEffectsWhenCalledAtPath(path, callOptions, innerOptions.addCalledReturnExpressionAtPath(path, _this));
                    }; }, options)));
        }
        return this.value.hasEffectsWhenCalledAtPath(path, callOptions, options);
    };
    Property.prototype.initialiseAndDeclare = function (parentScope, kind, _init) {
        this.initialiseScope(parentScope);
        this.initialiseNode(parentScope);
        this.key.initialise(parentScope);
        this.value.initialiseAndDeclare(parentScope, kind, values_1.UNKNOWN_EXPRESSION);
    };
    Property.prototype.initialiseNode = function (_parentScope) {
        this._accessorCallOptions = CallOptions_1.default.create({
            withNew: false,
            caller: this
        });
    };
    Property.prototype.render = function (code) {
        if (!this.shorthand) {
            this.key.render(code);
        }
        this.value.render(code);
    };
    Property.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        if (this.kind === 'get') {
            return (this.value.hasEffectsWhenCalledAtPath([], this._accessorCallOptions, options.getHasEffectsWhenCalledOptions()) ||
                this.value.someReturnExpressionWhenCalledAtPath([], this._accessorCallOptions, function (innerOptions) { return function (node) {
                    return node.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, innerOptions);
                }; }, options));
        }
        return this.value.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, options);
    };
    return Property;
}(Node_1.NodeBase));
exports.default = Property;
