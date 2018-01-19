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
var VariableDeclarator = /** @class */ (function (_super) {
    __extends(VariableDeclarator, _super);
    function VariableDeclarator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VariableDeclarator.prototype.reassignPath = function (path, options) {
        this.id.reassignPath(path, options);
    };
    VariableDeclarator.prototype.initialiseDeclarator = function (parentScope, kind) {
        this.initialiseScope(parentScope);
        this.init && this.init.initialise(this.scope);
        this.id.initialiseAndDeclare(this.scope, kind, this.init);
    };
    return VariableDeclarator;
}(Node_1.NodeBase));
exports.default = VariableDeclarator;
