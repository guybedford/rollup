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
var Identifier_1 = require("./Identifier");
var Node_1 = require("./shared/Node");
var UpdateExpression = /** @class */ (function (_super) {
    __extends(UpdateExpression, _super);
    function UpdateExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateExpression.prototype.bindNode = function () {
        this.argument.reassignPath([], ExecutionPathOptions_1.default.create());
        if (Identifier_1.isIdentifier(this.argument)) {
            var variable = this.scope.findVariable(this.argument.name);
            variable.isReassigned = true;
        }
    };
    UpdateExpression.prototype.hasEffects = function (options) {
        return (this.argument.hasEffects(options) ||
            this.argument.hasEffectsWhenAssignedAtPath([], options));
    };
    UpdateExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, _options) {
        return path.length > 1;
    };
    return UpdateExpression;
}(Node_1.NodeBase));
exports.default = UpdateExpression;
