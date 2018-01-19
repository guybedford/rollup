"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrapDynamicImportPlugin(acorn) {
    acorn.tokTypes._import.startsExpr = true;
    acorn.plugins.dynamicImport = function (instance) {
        instance.extend('parseStatement', function (nextMethod) {
            return function parseStatement() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var node = this.startNode();
                if (this.type === acorn.tokTypes._import) {
                    var nextToken = this.input[this.pos];
                    if (nextToken === acorn.tokTypes.parenL.label) {
                        var expr = this.parseExpression();
                        return this.parseExpressionStatement(node, expr);
                    }
                }
                return nextMethod.apply(this, args);
            };
        });
        instance.extend('parseExprAtom', function (nextMethod) {
            return function parseExprAtom(refDestructuringErrors) {
                if (this.type === acorn.tokTypes._import) {
                    var node = this.startNode();
                    this.next();
                    if (this.type !== acorn.tokTypes.parenL) {
                        this.unexpected();
                    }
                    return this.finishNode(node, 'Import');
                }
                return nextMethod.call(this, refDestructuringErrors);
            };
        });
    };
}
exports.default = wrapDynamicImportPlugin;
