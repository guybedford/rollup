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
var extractNames_1 = require("../utils/extractNames");
var values_1 = require("../values");
var VariableDeclaration_1 = require("./VariableDeclaration");
var Statement_1 = require("./shared/Statement");
// Statement types which may contain if-statements as direct children.
var statementsWithIfStatements = new Set([
    'DoWhileStatement',
    'ForInStatement',
    'ForOfStatement',
    'ForStatement',
    'IfStatement',
    'WhileStatement'
]);
function getHoistedVars(node, scope) {
    var hoistedVars = [];
    function visit(node) {
        if (VariableDeclaration_1.isVariableDeclaration(node) && node.kind === 'var') {
            node.declarations.forEach(function (declarator) {
                declarator.init = null;
                declarator.initialise(scope);
                extractNames_1.default(declarator.id).forEach(function (name) {
                    if (hoistedVars.indexOf(name) < 0)
                        hoistedVars.push(name);
                });
            });
        }
        else if (!/Function/.test(node.type)) {
            node.eachChild(visit);
        }
    }
    visit(node);
    return hoistedVars;
}
var IfStatement = /** @class */ (function (_super) {
    __extends(IfStatement, _super);
    function IfStatement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IfStatement.prototype.initialiseChildren = function (parentScope) {
        _super.prototype.initialiseChildren.call(this, parentScope);
        if (this.module.graph.treeshake) {
            this.testValue = this.test.getValue();
            if (this.testValue === values_1.UNKNOWN_VALUE) {
                return;
            }
            if (this.testValue) {
                if (this.alternate) {
                    this.hoistedVars = getHoistedVars(this.alternate, this.scope);
                    this.alternate = null;
                }
            }
            else {
                this.hoistedVars = getHoistedVars(this.consequent, this.scope);
                this.consequent = null;
            }
        }
    };
    IfStatement.prototype.render = function (code) {
        var _this = this;
        if (this.module.graph.treeshake) {
            if (this.testValue === values_1.UNKNOWN_VALUE) {
                _super.prototype.render.call(this, code);
            }
            else {
                code.overwrite(this.test.start, this.test.end, JSON.stringify(this.testValue));
                // TODO if no block-scoped declarations, remove enclosing
                // curlies and dedent block (if there is a block)
                if (this.hoistedVars) {
                    var names = this.hoistedVars
                        .map(function (name) {
                        var variable = _this.scope.findVariable(name);
                        return variable.included ? variable.getName() : null;
                    })
                        .filter(Boolean);
                    if (names.length > 0) {
                        code.appendLeft(this.start, "var " + names.join(', ') + ";\n\n");
                    }
                }
                if (this.testValue) {
                    code.remove(this.start, this.consequent.start);
                    code.remove(this.consequent.end, this.end);
                    this.consequent.render(code);
                }
                else {
                    code.remove(this.start, this.alternate ? this.alternate.start : this.next || this.end);
                    if (this.alternate) {
                        this.alternate.render(code);
                    }
                    else if (statementsWithIfStatements.has(this.parent.type)) {
                        code.prependRight(this.start, '{}');
                    }
                }
            }
        }
        else {
            _super.prototype.render.call(this, code);
        }
    };
    return IfStatement;
}(Statement_1.StatementBase));
exports.default = IfStatement;
