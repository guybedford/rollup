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
var extractNames_1 = require("../utils/extractNames");
var ExecutionPathOptions_1 = require("../ExecutionPathOptions");
var Identifier_1 = require("./Identifier");
function getSeparator(code, start) {
    var c = start;
    while (c > 0 && code[c - 1] !== '\n') {
        c -= 1;
        if (code[c] === ';' || code[c] === '{')
            return '; ';
    }
    var lineStart = code.slice(c, start).match(/^\s*/)[0];
    return ";\n" + lineStart;
}
var forStatement = /^For(?:Of|In)?Statement/;
function isVariableDeclaration(node) {
    return node.type === "VariableDeclaration" /* VariableDeclaration */;
}
exports.isVariableDeclaration = isVariableDeclaration;
var VariableDeclaration = /** @class */ (function (_super) {
    __extends(VariableDeclaration, _super);
    function VariableDeclaration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VariableDeclaration.prototype.reassignPath = function (_path, _options) {
        this.declarations.forEach(function (declarator) { return declarator.reassignPath([], ExecutionPathOptions_1.default.create()); });
    };
    VariableDeclaration.prototype.hasEffectsWhenAssignedAtPath = function (_path, _options) {
        return false;
    };
    VariableDeclaration.prototype.includeWithAllDeclarations = function () {
        var addedNewNodes = !this.included;
        this.included = true;
        this.declarations.forEach(function (declarator) {
            if (declarator.includeInBundle()) {
                addedNewNodes = true;
            }
        });
        return addedNewNodes;
    };
    VariableDeclaration.prototype.includeInBundle = function () {
        var addedNewNodes = !this.included;
        this.included = true;
        this.declarations.forEach(function (declarator) {
            if (declarator.shouldBeIncluded()) {
                if (declarator.includeInBundle()) {
                    addedNewNodes = true;
                }
            }
        });
        return addedNewNodes;
    };
    VariableDeclaration.prototype.initialiseChildren = function () {
        var _this = this;
        this.declarations.forEach(function (child) {
            return child.initialiseDeclarator(_this.scope, _this.kind);
        });
    };
    VariableDeclaration.prototype.render = function (code) {
        var _this = this;
        var treeshake = this.module.graph.treeshake;
        var shouldSeparate = false;
        var separator;
        if (this.scope.isModuleScope && !forStatement.test(this.parent.type)) {
            shouldSeparate = true;
            separator = getSeparator(this.module.code, this.start);
        }
        var c = this.start;
        var empty = true;
        var _loop_1 = function (i) {
            var declarator = this_1.declarations[i];
            var prefix = empty ? '' : separator; // TODO indentation
            if (Identifier_1.isIdentifier(declarator.id)) {
                var variable = this_1.scope.findVariable(declarator.id.name);
                var isExportedAndReassigned = variable.safeName && variable.safeName.indexOf('.') !== -1 && variable.exportName && variable.isReassigned;
                if (isExportedAndReassigned) {
                    if (declarator.init) {
                        if (shouldSeparate)
                            code.overwrite(c, declarator.start, prefix);
                        c = declarator.end;
                        empty = false;
                    }
                }
                else if (!treeshake || variable.included) {
                    if (shouldSeparate)
                        code.overwrite(c, declarator.start, "" + prefix + this_1.kind + " "); // TODO indentation
                    c = declarator.end;
                    empty = false;
                }
            }
            else {
                var exportAssignments_1 = [];
                var isIncluded_1 = false;
                extractNames_1.default(declarator.id).forEach(function (name) {
                    var variable = _this.scope.findVariable(name);
                    var isExportedAndReassigned = variable.safeName && variable.safeName.indexOf('.') !== -1 && variable.exportName && variable.isReassigned;
                    if (isExportedAndReassigned) {
                        // code.overwrite( c, declarator.start, prefix );
                        // c = declarator.end;
                        // empty = false;
                        exportAssignments_1.push('TODO');
                    }
                    else if (declarator.included) {
                        isIncluded_1 = true;
                    }
                });
                if (!treeshake || isIncluded_1) {
                    if (shouldSeparate)
                        code.overwrite(c, declarator.start, "" + prefix + this_1.kind + " "); // TODO indentation
                    c = declarator.end;
                    empty = false;
                }
                if (exportAssignments_1.length) {
                    throw new Error('TODO');
                }
            }
            declarator.render(code);
        };
        var this_1 = this;
        for (var i = 0; i < this.declarations.length; i += 1) {
            _loop_1(i);
        }
        if (treeshake && empty) {
            code.remove(this.leadingCommentStart || this.start, this.next || this.end);
        }
        else {
            // always include a semi-colon (https://github.com/rollup/rollup/pull/1013),
            // unless it's a var declaration in a loop head
            var needsSemicolon = !forStatement.test(this.parent.type) || this === this.parent.body;
            if (this.end > c) {
                code.overwrite(c, this.end, needsSemicolon ? ';' : '');
            }
            else if (needsSemicolon) {
                this.insertSemicolon(code);
            }
        }
    };
    return VariableDeclaration;
}(Node_1.NodeBase));
exports.default = VariableDeclaration;
