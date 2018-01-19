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
var AssignmentPattern = /** @class */ (function (_super) {
    __extends(AssignmentPattern, _super);
    function AssignmentPattern() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssignmentPattern.prototype.bindNode = function () {
        this.left.reassignPath([], ExecutionPathOptions_1.default.create());
    };
    AssignmentPattern.prototype.reassignPath = function (path, options) {
        path.length === 0 && this.left.reassignPath(path, options);
    };
    AssignmentPattern.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length > 0 || this.left.hasEffectsWhenAssignedAtPath([], options));
    };
    AssignmentPattern.prototype.initialiseAndDeclare = function (parentScope, kind, init) {
        this.initialiseScope(parentScope);
        this.right.initialise(parentScope);
        this.left.initialiseAndDeclare(parentScope, kind, init);
    };
    return AssignmentPattern;
}(Node_1.NodeBase));
exports.default = AssignmentPattern;
