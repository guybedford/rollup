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
var relativeId_1 = require("../../utils/relativeId");
var Node_1 = require("./shared/Node");
var VariableReassignmentTracker_1 = require("../variables/VariableReassignmentTracker");
var Literal_1 = require("./Literal");
var Identifier_1 = require("./Identifier");
var NamespaceVariable_1 = require("../variables/NamespaceVariable");
var ExternalVariable_1 = require("../variables/ExternalVariable");
var validProp = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function getPropertyKey(memberExpression) {
    return memberExpression.computed
        ? getComputedPropertyKey(memberExpression.property)
        : memberExpression.property.name;
}
function getComputedPropertyKey(propertyKey) {
    if (Literal_1.isLiteral(propertyKey)) {
        var key = String(propertyKey.value);
        return validProp.test(key) ? key : VariableReassignmentTracker_1.UNKNOWN_KEY;
    }
    return VariableReassignmentTracker_1.UNKNOWN_KEY;
}
function getPathIfNotComputed(memberExpression) {
    var nextPathKey = memberExpression.propertyKey;
    var object = memberExpression.object;
    if (VariableReassignmentTracker_1.isUnknownKey(nextPathKey)) {
        return null;
    }
    if (Identifier_1.isIdentifier(object)) {
        return [
            { key: object.name, pos: object.start },
            { key: nextPathKey, pos: memberExpression.property.start }
        ];
    }
    if (isMemberExpression(object)) {
        var parentPath = getPathIfNotComputed(object);
        return parentPath
            && parentPath.concat([{ key: nextPathKey, pos: memberExpression.property.start }]);
    }
    return null;
}
function isMemberExpression(node) {
    return node.type === "MemberExpression" /* MemberExpression */;
}
exports.isMemberExpression = isMemberExpression;
var MemberExpression = /** @class */ (function (_super) {
    __extends(MemberExpression, _super);
    function MemberExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MemberExpression.prototype.bind = function () {
        var path = getPathIfNotComputed(this);
        var baseVariable = path && this.scope.findVariable(path[0].key);
        if (baseVariable && NamespaceVariable_1.isNamespaceVariable(baseVariable)) {
            var resolvedVariable = this.resolveNamespaceVariables(baseVariable, path.slice(1));
            if (!resolvedVariable) {
                this.bindChildren();
            }
            else if (typeof resolvedVariable === 'string') {
                this.replacement = resolvedVariable;
            }
            else {
                if (ExternalVariable_1.isExternalVariable(resolvedVariable)) {
                    resolvedVariable.module.suggestName(path[0].key);
                }
                this.variable = resolvedVariable;
            }
        }
        else {
            this.bindChildren();
        }
        this.isBound = true;
    };
    MemberExpression.prototype.resolveNamespaceVariables = function (baseVariable, path) {
        if (path.length === 0)
            return baseVariable;
        if (!NamespaceVariable_1.isNamespaceVariable(baseVariable))
            return null;
        var exportName = path[0].key;
        var variable = baseVariable.module.traceExport(exportName);
        if (!variable) {
            this.module.warn({
                code: 'MISSING_EXPORT',
                missing: exportName,
                importer: relativeId_1.default(this.module.id),
                exporter: relativeId_1.default(baseVariable.module.id),
                message: "'" + exportName + "' is not exported by '" + relativeId_1.default(baseVariable.module.id) + "'",
                url: "https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module"
            }, path[0].pos);
            return 'undefined';
        }
        return this.resolveNamespaceVariables(variable, path.slice(1));
    };
    MemberExpression.prototype.forEachReturnExpressionWhenCalledAtPath = function (path, callOptions, callback, options) {
        if (!this.isBound)
            this.bind();
        if (this.variable) {
            this.variable.forEachReturnExpressionWhenCalledAtPath(path, callOptions, callback, options);
        }
        else {
            this.object.forEachReturnExpressionWhenCalledAtPath([this.propertyKey].concat(path), callOptions, callback, options);
        }
    };
    MemberExpression.prototype.hasEffects = function (options) {
        return (_super.prototype.hasEffects.call(this, options) ||
            (this.arePropertyReadSideEffectsChecked &&
                this.object.hasEffectsWhenAccessedAtPath([this.propertyKey], options)));
    };
    MemberExpression.prototype.hasEffectsWhenAccessedAtPath = function (path, options) {
        if (path.length === 0) {
            return false;
        }
        if (this.variable) {
            return this.variable.hasEffectsWhenAccessedAtPath(path, options);
        }
        return this.object.hasEffectsWhenAccessedAtPath([this.propertyKey].concat(path), options);
    };
    MemberExpression.prototype.hasEffectsWhenAssignedAtPath = function (path, options) {
        if (this.variable) {
            return this.variable.hasEffectsWhenAssignedAtPath(path, options);
        }
        return this.object.hasEffectsWhenAssignedAtPath([this.propertyKey].concat(path), options);
    };
    MemberExpression.prototype.hasEffectsWhenCalledAtPath = function (path, callOptions, options) {
        if (this.variable) {
            return this.variable.hasEffectsWhenCalledAtPath(path, callOptions, options);
        }
        return (this.propertyKey === VariableReassignmentTracker_1.UNKNOWN_KEY ||
            this.object.hasEffectsWhenCalledAtPath([this.propertyKey].concat(path), callOptions, options));
    };
    MemberExpression.prototype.includeInBundle = function () {
        var addedNewNodes = _super.prototype.includeInBundle.call(this);
        if (this.variable && !this.variable.included) {
            this.variable.includeVariable();
            addedNewNodes = true;
        }
        return addedNewNodes;
    };
    MemberExpression.prototype.initialiseNode = function () {
        this.propertyKey = getPropertyKey(this);
        this.arePropertyReadSideEffectsChecked =
            this.module.graph.treeshake &&
                this.module.graph.treeshakingOptions.propertyReadSideEffects;
    };
    MemberExpression.prototype.reassignPath = function (path, options) {
        if (!this.isBound)
            this.bind();
        if (path.length === 0)
            this.disallowNamespaceReassignment();
        if (this.variable) {
            this.variable.reassignPath(path, options);
        }
        else {
            this.object.reassignPath([this.propertyKey].concat(path), options);
        }
    };
    MemberExpression.prototype.disallowNamespaceReassignment = function () {
        if (Identifier_1.isIdentifier(this.object) && NamespaceVariable_1.isNamespaceVariable(this.scope.findVariable(this.object.name))) {
            this.module.error({
                code: 'ILLEGAL_NAMESPACE_REASSIGNMENT',
                message: "Illegal reassignment to import '" + this.object.name + "'"
            }, this.start);
        }
    };
    MemberExpression.prototype.render = function (code) {
        if (this.variable) {
            code.overwrite(this.start, this.end, this.variable.getName(), {
                storeName: true,
                contentOnly: false
            });
        }
        else if (this.replacement) {
            code.overwrite(this.start, this.end, this.replacement, {
                storeName: true,
                contentOnly: false
            });
        }
        _super.prototype.render.call(this, code);
    };
    MemberExpression.prototype.someReturnExpressionWhenCalledAtPath = function (path, callOptions, predicateFunction, options) {
        if (this.variable) {
            return this.variable.someReturnExpressionWhenCalledAtPath(path, callOptions, predicateFunction, options);
        }
        return (getPropertyKey(this) === VariableReassignmentTracker_1.UNKNOWN_KEY ||
            this.object.someReturnExpressionWhenCalledAtPath([this.propertyKey].concat(path), callOptions, predicateFunction, options));
    };
    return MemberExpression;
}(Node_1.NodeBase));
exports.default = MemberExpression;
