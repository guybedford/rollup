"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./utils/object");
var identifierHelpers_1 = require("./utils/identifierHelpers");
var ExternalVariable_1 = require("./ast/variables/ExternalVariable");
var ExternalModule = /** @class */ (function () {
    function ExternalModule(_a) {
        var graph = _a.graph, id = _a.id;
        this.graph = graph;
        this.id = id;
        var parts = id.split(/[\\/]/);
        this.name = identifierHelpers_1.makeLegal(parts.pop());
        this.nameSuggestions = object_1.blank();
        this.mostCommonSuggestion = 0;
        this.isExternal = true;
        this.used = false;
        this.declarations = object_1.blank();
        this.exportsNames = false;
    }
    ExternalModule.prototype.suggestName = function (name) {
        if (!this.nameSuggestions[name])
            this.nameSuggestions[name] = 0;
        this.nameSuggestions[name] += 1;
        if (this.nameSuggestions[name] > this.mostCommonSuggestion) {
            this.mostCommonSuggestion = this.nameSuggestions[name];
            this.name = name;
        }
    };
    ExternalModule.prototype.warnUnusedImports = function () {
        var _this = this;
        var unused = Object.keys(this.declarations)
            .filter(function (name) { return name !== '*'; })
            .filter(function (name) {
            return !_this.declarations[name].included &&
                !_this.declarations[name].reexported;
        });
        if (unused.length === 0)
            return;
        var names = unused.length === 1
            ? "'" + unused[0] + "' is"
            : unused
                .slice(0, -1)
                .map(function (name) { return "'" + name + "'"; })
                .join(', ') + " and '" + unused.slice(-1) + "' are";
        this.graph.warn({
            code: 'UNUSED_EXTERNAL_IMPORT',
            source: this.id,
            names: unused,
            message: names + " imported from external module '" + this.id + "' but never used"
        });
    };
    ExternalModule.prototype.traceExport = function (name) {
        if (name !== 'default' && name !== '*')
            this.exportsNames = true;
        if (name === '*')
            this.exportsNamespace = true;
        return this.declarations[name] ||
            (this.declarations[name] = new ExternalVariable_1.default(this, name));
    };
    return ExternalModule;
}());
exports.default = ExternalModule;
