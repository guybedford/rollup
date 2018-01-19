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
var ObjectPattern = /** @class */ (function (_super) {
    __extends(ObjectPattern, _super);
    function ObjectPattern() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectPattern.prototype.reassignPath = function (path, options) {
        path.length === 0 &&
            this.properties.forEach(function (child) { return child.reassignPath(path, options); });
    };
    ObjectPattern.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (path.length > 0 ||
            this.properties.some(function (child) { return child.hasEffectsWhenAssignedAtPath([], options); }));
    };
    ObjectPattern.prototype.initialiseAndDeclare = function (parentScope, kind, init) {
        this.initialiseScope(parentScope);
        this.properties.forEach(function (child) {
            return child.initialiseAndDeclare(parentScope, kind, init);
        });
    };
    return ObjectPattern;
}(Node_1.NodeBase));
exports.default = ObjectPattern;
