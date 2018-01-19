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
var RestElement = /** @class */ (function (_super) {
    __extends(RestElement, _super);
    function RestElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RestElement.prototype.reassignPath = function (path, options) {
        path.length === 0 && this.argument.reassignPath([], options);
    };
    RestElement.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length > 0 || this.argument.hasEffectsWhenAssignedAtPath([], options));
    };
    RestElement.prototype.initialiseAndDeclare = function (parentScope, kind, _init) {
        this.initialiseScope(parentScope);
        this.argument.initialiseAndDeclare(parentScope, kind, values_1.UNKNOWN_EXPRESSION);
    };
    return RestElement;
}(Node_1.NodeBase));
exports.default = RestElement;
