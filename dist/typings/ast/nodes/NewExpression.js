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
var CallOptions_1 = require("../CallOptions");
var Node_1 = require("./shared/Node");
var NewExpression = /** @class */ (function (_super) {
    __extends(NewExpression, _super);
    function NewExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewExpression.prototype.hasEffects = function (options) {
        return (this.arguments.some(function (child) { return child.hasEffects(options); }) ||
            this.callee.hasEffectsWhenCalledAtPath([], this._callOptions, options.getHasEffectsWhenCalledOptions()));
    };
    NewExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 1;
    };
    NewExpression.prototype.initialiseNode = function () {
        this._callOptions = CallOptions_1.default.create({
            withNew: true,
            args: this.arguments,
            caller: this
        });
    };
    return NewExpression;
}(Node_1.NodeBase));
exports.default = NewExpression;
