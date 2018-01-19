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
var is_reference_1 = require("is-reference");
var values_1 = require("../values");
function isIdentifier(node) {
    return node.type === "Identifier" /* Identifier */;
}
exports.isIdentifier = isIdentifier;
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Identifier.prototype.bindNode = function () {
        if (is_reference_1.default(this, this.parent)) {
            this.variable = this.scope.findVariable(this.name);
            this.variable.addReference(this);
        }
    };
    Identifier.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        if (!this.isBound)
            this.bind();
        this.variable &&
            this.variable.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, options);
    };
    Identifier.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        return (this.variable && this.variable.hasEffectsWhenAccessedAtPath(path, options));
    };
    Identifier.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        return (!this.variable ||
            this.variable.hasEffectsWhenAssignedAtPath(path, options));
    };
    Identifier.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        return (!this.variable ||
            this.variable.hasEffectsWhenCalledAtPath(path, callOptions, options));
    };
    Identifier.prototype.includeInBundle = function () {
        if (this.included)
            return false;
        this.included = true;
        this.variable && this.variable.includeVariable();
        return true;
    };
    Identifier.prototype.initialiseAndDeclare = function (parentScope, kind, init) {
        this.initialiseScope(parentScope);
        switch (kind) {
            case 'var':
            case 'function':
                this.variable = this.scope.addDeclaration(this, {
                    isHoisted: true,
                    init: init
                });
                break;
            case 'let':
            case 'const':
            case 'class':
                this.variable = this.scope.addDeclaration(this, { init: init });
                break;
            case 'parameter':
                this.variable = this.scope.addParameterDeclaration(this);
                break;
            default:
                throw new Error("Unexpected identifier kind " + kind + ".");
        }
    };
    Identifier.prototype.reassignPath = function (path, options) {
        if (!this.isBound)
            this.bind();
        if (this.variable) {
            if (path.length === 0)
                this.disallowImportReassignment();
            this.variable.reassignPath(path, options);
        }
    };
    Identifier.prototype.disallowImportReassignment = function () {
        if (this.module.imports[this.name] && !this.scope.contains(this.name)) {
            this.module.error({
                code: 'ILLEGAL_REASSIGNMENT',
                message: "Illegal reassignment to import '" + this.name + "'"
            }, this.start);
        }
    };
    Identifier.prototype.render = function (code) {
        if (this.variable) {
            var name_1 = this.variable.getName();
            if (name_1 !== this.name) {
                code.overwrite(this.start, this.end, name_1, {
                    storeName: true,
                    contentOnly: false
                });
                // special case
                if (this.parent.type === "Property" /* Property */ && this.parent.shorthand) {
                    code.appendLeft(this.start, this.name + ": ");
                }
            }
        }
    };
    Identifier.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        if (this.variable) {
            return this.variable.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, options);
        }
        return predicateFunction(options)(values_1.UNKNOWN_EXPRESSION);
    };
    return Identifier;
}(Node_1.NodeBase));
exports.default = Identifier;
