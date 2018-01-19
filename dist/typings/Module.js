"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var acorn = require("acorn");
var dynamic_import_plugin_1 = require("./utils/dynamic-import-plugin");
var magic_string_1 = require("magic-string");
var locate_character_1 = require("locate-character");
var flushTime_1 = require("./utils/flushTime");
var object_1 = require("./utils/object");
var path_1 = require("./utils/path");
var identifierHelpers_1 = require("./utils/identifierHelpers");
var getCodeFrame_1 = require("./utils/getCodeFrame");
var sourceMappingURL_1 = require("./utils/sourceMappingURL");
var error_1 = require("./utils/error");
var NamespaceVariable_1 = require("./ast/variables/NamespaceVariable");
var extractNames_1 = require("./ast/utils/extractNames");
var enhance_1 = require("./ast/enhance");
var clone_1 = require("./ast/clone");
var ModuleScope_1 = require("./ast/scopes/ModuleScope");
var sourcemap_codec_1 = require("sourcemap-codec");
var source_map_1 = require("source-map");
var TemplateLiteral_1 = require("./ast/nodes/TemplateLiteral");
var Literal_1 = require("./ast/nodes/Literal");
var defaults_1 = require("./utils/defaults");
dynamic_import_plugin_1.default(acorn);
function tryParse(module, acornOptions) {
    try {
        return acorn.parse(module.code, Object.assign({
            ecmaVersion: 8,
            sourceType: 'module',
            onComment: function (block, text, start, end) {
                return module.comments.push({ block: block, text: text, start: start, end: end });
            },
            preserveParens: false
        }, acornOptions));
    }
    catch (err) {
        module.error({
            code: 'PARSE_ERROR',
            message: err.message.replace(/ \(\d+:\d+\)$/, '')
        }, err.pos);
    }
}
function includeFully(node) {
    node.included = true;
    if (node.variable && !node.variable.included) {
        node.variable.includeVariable();
    }
    node.eachChild(includeFully);
}
var Module = /** @class */ (function () {
    function Module(_a) {
        var id = _a.id, code = _a.code, originalCode = _a.originalCode, originalSourcemap = _a.originalSourcemap, ast = _a.ast, sourcemapChain = _a.sourcemapChain, resolvedIds = _a.resolvedIds, graph = _a.graph;
        var _this = this;
        this.code = code;
        this.id = id;
        this.graph = graph;
        this.originalCode = originalCode;
        this.originalSourcemap = originalSourcemap;
        this.sourcemapChain = sourcemapChain;
        this.comments = [];
        if (graph.dynamicImport) {
            this.dynamicImports = [];
            this.dynamicImportResolutions = [];
        }
        this.isEntryPoint = false;
        this.execIndex = undefined;
        flushTime_1.timeStart('ast');
        if (ast) {
            // prevent mutating the provided AST, as it may be reused on
            // subsequent incremental rebuilds
            this.ast = clone_1.default(ast);
            this.astClone = ast;
        }
        else {
            this.ast = tryParse(this, graph.acornOptions); // TODO what happens to comments if AST is provided?
            this.astClone = clone_1.default(this.ast);
        }
        flushTime_1.timeEnd('ast');
        this.excludeFromSourcemap = /\0/.test(id);
        this.context = graph.getModuleContext(id);
        // all dependencies
        this.sources = [];
        this.dependencies = [];
        this.resolvedIds = resolvedIds || object_1.blank();
        // imports and exports, indexed by local name
        this.imports = object_1.blank();
        this.exports = object_1.blank();
        this.exportsAll = object_1.blank();
        this.reexports = object_1.blank();
        this.exportAllSources = [];
        this.exportAllModules = null;
        // By default, `id` is the filename. Custom resolvers and loaders
        // can change that, but it makes sense to use it for the source filename
        this.magicString = new magic_string_1.default(code, {
            filename: this.excludeFromSourcemap ? null : id,
            indentExclusionRanges: []
        });
        // remove existing sourceMappingURL comments
        this.comments = this.comments.filter(function (comment) {
            //only one line comment can contain source maps
            var isSourceMapComment = !comment.block && sourceMappingURL_1.SOURCEMAPPING_URL_RE.test(comment.text);
            if (isSourceMapComment) {
                _this.magicString.remove(comment.start, comment.end);
            }
            return !isSourceMapComment;
        });
        this.declarations = object_1.blank();
        this.scope = new ModuleScope_1.default(this);
        flushTime_1.timeStart('analyse');
        this.analyse();
        flushTime_1.timeEnd('analyse');
        this.strongDependencies = [];
    }
    Module.prototype.addExport = function (node) {
        var _this = this;
        var source = node.source && node.source.value;
        // export { name } from './other'
        if (source) {
            if (!~this.sources.indexOf(source))
                this.sources.push(source);
            if (node.type === "ExportAllDeclaration" /* ExportAllDeclaration */) {
                // Store `export * from '...'` statements in an array of delegates.
                // When an unknown import is encountered, we see if one of them can satisfy it.
                this.exportAllSources.push(source);
            }
            else {
                node.specifiers.forEach(function (specifier) {
                    var name = specifier.exported.name;
                    if (_this.exports[name] || _this.reexports[name]) {
                        _this.error({
                            code: 'DUPLICATE_EXPORT',
                            message: "A module cannot have multiple exports with the same name ('" + name + "')"
                        }, specifier.start);
                    }
                    _this.reexports[name] = {
                        start: specifier.start,
                        source: source,
                        localName: specifier.local.name,
                        module: null // filled in later
                    };
                });
            }
        }
        else if (node.type === "ExportDefaultDeclaration" /* ExportDefaultDeclaration */) {
            // export default function foo () {}
            // export default foo;
            // export default 42;
            var identifier = (node.declaration.id
                && node.declaration.id.name)
                || node.declaration.name;
            if (this.exports.default) {
                this.error({
                    code: 'DUPLICATE_EXPORT',
                    message: "A module can only have one default export"
                }, node.start);
            }
            this.exports.default = {
                localName: 'default',
                identifier: identifier
            };
        }
        else if (node.declaration) {
            // export var { foo, bar } = ...
            // export var foo = 42;
            // export var a = 1, b = 2, c = 3;
            // export function foo () {}
            var declaration = node.declaration;
            if (declaration.type === "VariableDeclaration" /* VariableDeclaration */) {
                declaration.declarations.forEach(function (decl) {
                    extractNames_1.default(decl.id).forEach(function (localName) {
                        _this.exports[localName] = { localName: localName };
                    });
                });
            }
            else {
                // export function foo () {}
                var localName = declaration.id.name;
                this.exports[localName] = { localName: localName };
            }
        }
        else {
            // export { foo, bar, baz }
            node.specifiers.forEach(function (specifier) {
                var localName = specifier.local.name;
                var exportedName = specifier.exported.name;
                if (_this.exports[exportedName] || _this.reexports[exportedName]) {
                    _this.error({
                        code: 'DUPLICATE_EXPORT',
                        message: "A module cannot have multiple exports with the same name ('" + exportedName + "')"
                    }, specifier.start);
                }
                _this.exports[exportedName] = { localName: localName };
            });
        }
    };
    Module.prototype.addImport = function (node) {
        var _this = this;
        var source = node.source.value;
        if (!~this.sources.indexOf(source))
            this.sources.push(source);
        node.specifiers.forEach(function (specifier) {
            var localName = specifier.local.name;
            if (_this.imports[localName]) {
                _this.error({
                    code: 'DUPLICATE_IMPORT',
                    message: "Duplicated import '" + localName + "'"
                }, specifier.start);
            }
            var isDefault = specifier.type === "ImportDefaultSpecifier" /* ImportDefaultSpecifier */;
            var isNamespace = specifier.type === "ImportNamespaceSpecifier" /* ImportNamespaceSpecifier */;
            var name = isDefault
                ? 'default'
                : isNamespace ? '*' : specifier.imported.name;
            _this.imports[localName] = { source: source, specifier: specifier, name: name, module: null };
        });
    };
    Module.prototype.analyse = function () {
        var _this = this;
        enhance_1.default(this.ast, this, this.comments, this.dynamicImports);
        // discover this module's imports and exports
        var lastNode;
        this.ast.body.forEach(function (node) {
            if (node.isImportDeclaration) {
                _this.addImport(node);
            }
            else if (node.isExportDeclaration) {
                _this.addExport(node);
            }
            if (lastNode)
                lastNode.next = node.leadingCommentStart || node.start;
            lastNode = node;
        });
    };
    Module.prototype.basename = function () {
        var base = path_1.basename(this.id);
        var ext = path_1.extname(this.id);
        return identifierHelpers_1.makeLegal(ext ? base.slice(0, -ext.length) : base);
    };
    Module.prototype.markExports = function () {
        var _this = this;
        this.getExports().forEach(function (name) {
            var variable = _this.traceExport(name);
            variable.exportName = name;
            variable.includeVariable();
            if (variable.isNamespace) {
                variable.needsNamespaceBlock = true;
            }
        });
        this.getReexports().forEach(function (name) {
            var variable = _this.traceExport(name);
            variable.exportName = name;
            if (variable.isExternal) {
                variable.reexported = variable.module.reexported = true;
            }
            else {
                variable.includeVariable();
            }
        });
    };
    Module.prototype.linkDependencies = function () {
        var _this = this;
        this.sources.forEach(function (source) {
            var id = _this.resolvedIds[source];
            if (id) {
                var module_1 = _this.graph.moduleById.get(id);
                _this.dependencies.push(module_1);
            }
        });
        [this.imports, this.reexports].forEach(function (specifiers) {
            Object.keys(specifiers).forEach(function (name) {
                var specifier = specifiers[name];
                var id = _this.resolvedIds[specifier.source];
                specifier.module = _this.graph.moduleById.get(id);
            });
        });
        this.exportAllModules = this.exportAllSources.map(function (source) {
            var id = _this.resolvedIds[source];
            return _this.graph.moduleById.get(id);
        });
    };
    Module.prototype.bindReferences = function () {
        this.ast.body.forEach(function (node) { return node.bind(); });
    };
    Module.prototype.getDynamicImportExpressions = function () {
        return this.dynamicImports.map(function (node) {
            var importArgument = node.parent.arguments[0];
            if (TemplateLiteral_1.isTemplateLiteral(importArgument)) {
                if (importArgument.expressions.length === 0 && importArgument.quasis.length === 1) {
                    return importArgument.quasis[0].value.cooked;
                }
            }
            else if (Literal_1.isLiteral(importArgument)) {
                if (typeof (importArgument).value === 'string') {
                    return importArgument.value;
                }
            }
            else {
                return importArgument;
            }
        });
    };
    Module.prototype.getOriginalLocation = function (sourcemapChain, line, column) {
        var location = {
            line: line,
            column: column
        };
        var filteredSourcemapChain = sourcemapChain
            .filter(function (sourcemap) { return sourcemap.mappings; })
            .map(function (sourcemap) {
            var encodedSourcemap = sourcemap;
            if (sourcemap.mappings) {
                encodedSourcemap.mappings = sourcemap_codec_1.encode(encodedSourcemap.mappings);
            }
            return encodedSourcemap;
        });
        while (filteredSourcemapChain.length > 0) {
            var sourcemap = filteredSourcemapChain.pop();
            var smc = new source_map_1.SourceMapConsumer(sourcemap);
            location = smc.originalPositionFor({
                line: location.line,
                column: location.column
            });
        }
        return location;
    };
    Module.prototype.error = function (props, pos) {
        if (pos !== undefined) {
            props.pos = pos;
            var _a = locate_character_1.locate(this.code, pos, { offsetLine: 1 }), line = _a.line, column = _a.column;
            var location_1 = this.getOriginalLocation(this.sourcemapChain, line, column);
            props.loc = {
                file: this.id,
                line: location_1.line,
                column: location_1.column
            };
            props.frame = getCodeFrame_1.default(this.originalCode, location_1.line, location_1.column);
        }
        error_1.default(props);
    };
    Module.prototype.getAllExports = function () {
        var allExports = Object.assign(object_1.blank(), this.exports, this.reexports);
        this.exportAllModules.forEach(function (module) {
            if (module.isExternal) {
                allExports["*" + module.id] = true;
                return;
            }
            module
                .getAllExports()
                .forEach(function (name) {
                if (name !== 'default')
                    allExports[name] = true;
            });
        });
        return Object.keys(allExports);
    };
    Module.prototype.getExports = function () {
        return Object.keys(this.exports);
    };
    Module.prototype.getReexports = function () {
        var reexports = object_1.blank();
        Object.keys(this.reexports).forEach(function (name) {
            reexports[name] = true;
        });
        this.exportAllModules.forEach(function (module) {
            if (module.isExternal) {
                reexports["*" + module.id] = true;
                return;
            }
            module
                .getExports()
                .concat(module.getReexports())
                .forEach(function (name) {
                if (name !== 'default')
                    reexports[name] = true;
            });
        });
        return Object.keys(reexports);
    };
    Module.prototype.includeAllInBundle = function () {
        this.ast.body.forEach(includeFully);
    };
    Module.prototype.includeInBundle = function () {
        var addedNewNodes = false;
        this.ast.body.forEach(function (node) {
            if (node.shouldBeIncluded()) {
                if (node.includeInBundle()) {
                    addedNewNodes = true;
                }
            }
        });
        return addedNewNodes;
    };
    Module.prototype.namespace = function () {
        if (!this.declarations['*']) {
            this.declarations['*'] = new NamespaceVariable_1.default(this);
        }
        return this.declarations['*'];
    };
    Module.prototype.render = function (legacy, freeze) {
        var magicString = this.magicString.clone();
        this.ast.body.forEach(function (node) {
            node.render(magicString);
        });
        if (this.namespace().needsNamespaceBlock) {
            magicString.append('\n\n' + this.namespace().renderBlock(legacy, freeze, '\t')); // TODO use correct indentation
        }
        // TODO TypeScript: It seems magicString is missing type information here
        return magicString.trim();
    };
    Module.prototype.toJSON = function () {
        return {
            id: this.id,
            dependencies: this.dependencies.map(function (module) { return module.id; }),
            code: this.code,
            originalCode: this.originalCode,
            originalSourcemap: this.originalSourcemap,
            ast: this.astClone,
            sourcemapChain: this.sourcemapChain,
            resolvedIds: this.resolvedIds
        };
    };
    Module.prototype.trace = function (name) {
        // TODO this is slightly circular
        if (name in this.scope.variables) {
            return this.scope.variables[name];
        }
        if (name in this.imports) {
            var importDeclaration = this.imports[name];
            var otherModule = importDeclaration.module;
            if (!otherModule.isExternal && importDeclaration.name === '*') {
                return otherModule.namespace();
            }
            var declaration = otherModule.traceExport(importDeclaration.name);
            if (!declaration) {
                defaults_1.missingExport(this, importDeclaration.name, otherModule, importDeclaration.specifier.start);
            }
            return declaration;
        }
        return null;
    };
    Module.prototype.traceExport = function (name) {
        if (name[0] === '*') {
            // namespace
            if (name.length === 1) {
                return this.namespace();
                // export * from 'external'
            }
            else {
                var module_2 = this.graph.moduleById.get(name.slice(1));
                return module_2.traceExport('*');
            }
        }
        // export { foo } from './other'
        var reexportDeclaration = this.reexports[name];
        if (reexportDeclaration) {
            var declaration = reexportDeclaration.module.traceExport(reexportDeclaration.localName);
            if (!declaration) {
                defaults_1.missingExport(this, reexportDeclaration.localName, reexportDeclaration.module, reexportDeclaration.start);
            }
            return declaration;
        }
        var exportDeclaration = this.exports[name];
        if (exportDeclaration) {
            var name_1 = exportDeclaration.localName;
            var declaration = this.trace(name_1);
            return declaration || this.graph.scope.findVariable(name_1);
        }
        if (name === 'default')
            return;
        for (var i = 0; i < this.exportAllModules.length; i += 1) {
            var module_3 = this.exportAllModules[i];
            var declaration = module_3.traceExport(name);
            if (declaration)
                return declaration;
        }
    };
    Module.prototype.warn = function (warning, pos) {
        if (pos !== undefined) {
            warning.pos = pos;
            var _a = locate_character_1.locate(this.code, pos, { offsetLine: 1 }), line = _a.line, column = _a.column; // TODO trace sourcemaps, cf. error()
            warning.loc = { file: this.id, line: line, column: column };
            warning.frame = getCodeFrame_1.default(this.code, line, column);
        }
        warning.id = this.id;
        this.graph.warn(warning);
    };
    return Module;
}());
exports.default = Module;
