"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("../../utils/object");
var LocalVariable_1 = require("../variables/LocalVariable");
var ExportDefaultVariable_1 = require("../variables/ExportDefaultVariable");
var values_1 = require("../values");
var ExecutionPathOptions_1 = require("../ExecutionPathOptions");
var Scope = /** @class */ (function () {
    function Scope(options) {
        if (options === void 0) { options = {}; }
        this.parent = options.parent;
        this.isModuleScope = !!options.isModuleScope;
        this.children = [];
        if (this.parent)
            this.parent.children.push(this);
        this.variables = object_1.blank();
    }
    /**
     * @param identifier
     * @param {Object} [options] - valid options are
     *        {(Node|null)} init
     *        {boolean} isHoisted
     * @return {Variable}
     */
    Scope.prototype.addDeclaration = function (identifier, options) {
        if (options === void 0) { options = {
            init: null,
            isHoisted: false
        }; }
        var name = identifier.name;
        if (this.variables[name]) {
            var variable = this.variables[name];
            variable.addDeclaration(identifier);
            variable.reassignPath([], ExecutionPathOptions_1.default.create());
        }
        else {
            this.variables[name] = new LocalVariable_1.default(identifier.name, identifier, options.init || values_1.UNKNOWN_EXPRESSION);
        }
        return this.variables[name];
    };
    Scope.prototype.addExportDefaultDeclaration = function (name, exportDefaultDeclaration) {
        this.variables.default = new ExportDefaultVariable_1.default(name, exportDefaultDeclaration);
        return this.variables.default;
    };
    Scope.prototype.addReturnExpression = function (expression) {
        this.parent && this.parent.addReturnExpression(expression);
    };
    Scope.prototype.contains = function (name) {
        return (!!this.variables[name] ||
            (this.parent ? this.parent.contains(name) : false));
    };
    Scope.prototype.deshadow = function (names, children) {
        var _this = this;
        if (children === void 0) { children = this.children; }
        object_1.keys(this.variables).forEach(function (key) {
            var declaration = _this.variables[key];
            // we can disregard exports.foo etc
            if (declaration.exportName && declaration.isReassigned)
                return;
            var name = declaration.getName();
            if (!names.has(name)) {
                return;
            }
            name = declaration.name;
            var deshadowed, i = 1;
            do {
                deshadowed = name + "$$" + i++;
            } while (names.has(deshadowed));
            declaration.setSafeName(deshadowed);
        });
        children.forEach(function (scope) { return scope.deshadow(names); });
    };
    Scope.prototype.findLexicalBoundary = function () {
        return this.parent.findLexicalBoundary();
    };
    Scope.prototype.findVariable = function (name) {
        return this.variables[name] || (this.parent && this.parent.findVariable(name));
    };
    return Scope;
}());
exports.default = Scope;
