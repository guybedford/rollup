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
var ClassBody = /** @class */ (function (_super) {
    __extends(ClassBody, _super);
    function ClassBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassBody.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        if (path.length > 0) {
            return true;
        }
        return (this.classConstructor &&
            this.classConstructor.hasEffectsWhenCalledAtPath([], callOptions, options));
    };
    ClassBody.prototype.initialiseNode = function () {
        this.classConstructor = this.body.find(function (method) { return method.kind === 'constructor'; });
    };
    return ClassBody;
}(Node_1.NodeBase));
exports.default = ClassBody;
