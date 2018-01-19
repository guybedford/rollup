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
var CallOptions_1 = require("../CallOptions");
var GlobalVariable_1 = require("../variables/GlobalVariable");
var NamespaceVariable_1 = require("../variables/NamespaceVariable");
var Node_1 = require("./shared/Node");
var TaggedTemplateExpression = /** @class */ (function (_super) {
    __extends(TaggedTemplateExpression, _super);
    function TaggedTemplateExpression() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TaggedTemplateExpression.prototype.bindNode = function () {
        if (this.tag.type === "Identifier" /* Identifier */) {
            var variable = this.scope.findVariable(this.tag.name);
            if (NamespaceVariable_1.isNamespaceVariable(variable)) {
                this.module.error({
                    code: 'CANNOT_CALL_NAMESPACE',
                    message: "Cannot call a namespace ('" + this.tag.name + "')"
                }, this.start);
            }
            if (this.tag.name === 'eval' && GlobalVariable_1.isGlobalVariable(variable)) {
                this.module.warn({
                    code: 'EVAL',
                    message: "Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification",
                    url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval'
                }, this.start);
            }
        }
    };
    TaggedTemplateExpression.prototype.hasEffects = function (options) {
        return (_super.prototype.hasEffects.call(this, options) ||
            this.tag.hasEffectsWhenCalledAtPath([], this._callOptions, options.getHasEffectsWhenCalledOptions()));
    };
    TaggedTemplateExpression.prototype.initialiseNode = function () {
        this._callOptions = CallOptions_1.default.create({ withNew: false, caller: this });
    };
    return TaggedTemplateExpression;
}(Node_1.NodeBase));
exports.default = TaggedTemplateExpression;
