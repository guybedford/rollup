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
var values_1 = require("../values");
var Node_1 = require("./shared/Node");
var ArrayPattern = /** @class */ (function (_super) {
    __extends(ArrayPattern, _super);
    function ArrayPattern() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayPattern.prototype.reassignPath = function (path, options) {
        path.length === 0 &&
            this.elements.forEach(function (child) { return child && child.reassignPath([], options); });
    };
    ArrayPattern.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length > 0 ||
            this.elements.some(function (child) { return child && child.hasEffectsWhenAssignedAtPath([], options); }));
    };
    ArrayPattern.prototype.initialiseAndDeclare = function (parentScope, kind, _init) {
        this.initialiseScope(parentScope);
        this.elements.forEach(function (child) { return child && child.initialiseAndDeclare(parentScope, kind, values_1.UNKNOWN_EXPRESSION); });
    };
    return ArrayPattern;
}(Node_1.NodeBase));
exports.default = ArrayPattern;
