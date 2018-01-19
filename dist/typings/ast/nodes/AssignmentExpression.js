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
var ExecutionPathOptions_1 = require("../ExecutionPathOptions");
var Node_1 = require("./shared/Node");
var AssignmentExpression = /** @class */ (function (_super) {
    __extends(AssignmentExpression, _super);
    function AssignmentExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssignmentExpression.prototype.bindNode = function () {
        this.left.reassignPath([], ExecutionPathOptions_1.default.create());
    };
    AssignmentExpression.prototype.hasEffects = function (options) {
        return (_super.prototype.hasEffects.call(this, options) ||
            this.left.hasEffectsWhenAssignedAtPath([], options));
    };
    AssignmentExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (path.length > 0 && this.right.hasEffectsWhenAccessedAtPath(path, options));
    };
    return AssignmentExpression;
}(Node_1.NodeBase));
exports.default = AssignmentExpression;
