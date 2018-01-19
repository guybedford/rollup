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
var object_1 = require("../../utils/object");
var relativeId_1 = require("../../utils/relativeId");
var Scope_1 = require("./Scope");
var LocalVariable_1 = require("../variables/LocalVariable");
var values_1 = require("../values");
var NamespaceVariable_1 = require("../variables/NamespaceVariable");
var ExternalVariable_1 = require("../variables/ExternalVariable");
var ModuleScope = /** @class */ (function (_super) {
    __extends(ModuleScope, _super);
    function ModuleScope(module) {
        var _this = _super.call(this, {
            isModuleScope: true,
            parent: module.graph.scope
        }) || this;
        _this.module = module;
        _this.variables.this = new LocalVariable_1.default('this', null, values_1.UNKNOWN_EXPRESSION);
        return _this;
    }
    ModuleScope.prototype.deshadow = function (names, children) {
        var _this = this;
        if (children === void 0) { children = this.children; }
        var localNames = new Set(names);
        object_1.forOwn(this.module.imports, function (specifier) {
            if (specifier.module.isExternal || specifier.module.chunk !== _this.module.chunk) {
                return;
            }
            var addDeclaration = function (declaration) {
                if (NamespaceVariable_1.isNamespaceVariable(declaration) && !ExternalVariable_1.isExternalVariable(declaration)) {
                    declaration.module.getExports()
                        .forEach(function (name) { return addDeclaration(declaration.module.traceExport(name)); });
                }
                localNames.add(declaration.getName());
            };
            specifier.module.getExports().forEach(function (name) {
                addDeclaration(specifier.module.traceExport(name));
            });
            if (specifier.name !== '*') {
                var declaration = specifier.module.traceExport(specifier.name);
                if (!declaration) {
                    _this.module.warn({
                        code: 'NON_EXISTENT_EXPORT',
                        name: specifier.name,
                        source: specifier.module.id,
                        message: "Non-existent export '" + specifier.name + "' is imported from " + relativeId_1.default(specifier.module.id)
                    }, specifier.specifier.start);
                    return;
                }
                var name_1 = declaration.getName();
                if (name_1 !== specifier.name) {
                    localNames.add(name_1);
                }
                if (specifier.name !== 'default' &&
                    specifier.specifier.imported.name !== specifier.specifier.local.name) {
                    localNames.add(specifier.specifier.imported.name);
                }
            }
        });
        _super.prototype.deshadow.call(this, localNames, children);
    };
    ModuleScope.prototype.findLexicalBoundary = function () {
        return this;
    };
    ModuleScope.prototype.findVariable = function (name) {
        if (this.variables[name]) {
            return this.variables[name];
        }
        return this.module.trace(name) || this.parent.findVariable(name);
    };
    return ModuleScope;
}(Scope_1.default));
exports.default = ModuleScope;
