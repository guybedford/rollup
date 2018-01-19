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
var NamespaceVariable_1 = require("../variables/NamespaceVariable");
;
var Import = /** @class */ (function (_super) {
    __extends(Import, _super);
    function Import() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Import.prototype.setResolution = function (resolution, mechanism) {
        this.resolution = resolution;
        if (mechanism) {
            this.mechanism = mechanism;
        }
    };
    Import.prototype.render = function (code) {
        // if we have the module in the chunk, inline as Promise.resolve(namespace)
        var resolution;
        if (this.resolution instanceof NamespaceVariable_1.default) {
            // ideally this should be handled like normal tree shaking
            this.resolution.includeVariable();
            resolution = this.resolution.getName();
        }
        else if (this.resolution) {
            resolution = this.resolution;
        }
        if (this.mechanism) {
            code.overwrite(this.parent.start, this.parent.arguments[0].start, this.mechanism.left);
        }
        if (resolution) {
            code.overwrite(this.parent.arguments[0].start, this.parent.arguments[0].end, resolution);
        }
        if (this.mechanism) {
            code.overwrite(this.parent.arguments[0].end, this.parent.end, this.mechanism.right);
        }
    };
    return Import;
}(Node_1.NodeBase));
exports.default = Import;
