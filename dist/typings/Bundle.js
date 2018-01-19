"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flushTime_1 = require("./utils/flushTime");
var sourcemap_codec_1 = require("sourcemap-codec");
var magic_string_1 = require("magic-string");
var array_1 = require("./utils/array");
var object_1 = require("./utils/object");
var Module_1 = require("./Module");
var index_1 = require("./finalisers/index");
var getExportMode_1 = require("./utils/getExportMode");
var getIndentString_1 = require("./utils/getIndentString");
var promise_1 = require("./utils/promise");
var transformBundle_1 = require("./utils/transformBundle");
var collapseSourcemaps_1 = require("./utils/collapseSourcemaps");
var callIfFunction_1 = require("./utils/callIfFunction");
var error_1 = require("./utils/error");
var path_1 = require("./utils/path");
var ExternalModule_1 = require("./ExternalModule");
var identifierHelpers_1 = require("./utils/identifierHelpers");
;
;
var Bundle = /** @class */ (function () {
    function Bundle(graph, id, orderedModules) {
        var _this = this;
        this.setId(id);
        this.graph = graph;
        this.orderedModules = orderedModules;
        this.exportedVariables = new Map();
        this.imports = [];
        this.exports = {};
        this.externalModules = undefined;
        this.dependencies = undefined;
        this.entryModule = undefined;
        this.entryModuleFacade = false;
        orderedModules.forEach(function (module) {
            if (module.isEntryPoint) {
                if (!_this.entryModule) {
                    _this.entryModule = module;
                    _this.entryModuleFacade = true;
                }
                else {
                    _this.entryModuleFacade = false;
                }
            }
            module.bundle = _this;
        });
    }
    Bundle.prototype.setId = function (id) {
        this.id = id;
        this.name = identifierHelpers_1.makeLegal(id);
    };
    // ensure that the module exports or reexports the given variable
    // we don't replace reexports with the direct reexport from the final module
    // as this might result in exposing an internal module which taints an entryModule bundle
    Bundle.prototype.ensureExport = function (module, variable) {
        var safeExportName = this.exportedVariables.get(variable);
        if (safeExportName) {
            return safeExportName;
        }
        var i = 0;
        if (variable.exportName) {
            safeExportName = variable.exportName;
        }
        else {
            safeExportName = variable.exportName = variable.name;
        }
        var curExport = this.exports[safeExportName];
        while (curExport) {
            safeExportName = (variable.exportName || variable.name) + '$' + ++i;
            curExport = this.exports[safeExportName];
        }
        curExport = this.exports[safeExportName] = { module: module, name: undefined, variable: variable };
        this.exportedVariables.set(variable, safeExportName);
        // if we've just exposed an export of a non-entry-point,
        // then note we are no longer an entry point bundle
        // we will then need an entry point facade if this is an entry point module
        if (this.entryModuleFacade && module.bundle === this && !module.isEntryPoint) {
            this.entryModuleFacade = false;
        }
        // if we are reexporting a module in another bundle
        // then we also have to ensure it is an export there too
        // and note the name it comes from
        if (module.bundle !== this && !module.isExternal) {
            curExport.name = module.bundle.ensureExport(module, variable);
        }
        else {
            curExport.name = safeExportName;
        }
        return safeExportName;
    };
    Bundle.prototype.generateEntryExports = function (entryModule) {
        var _this = this;
        entryModule.getAllExports().forEach(function (exportName) {
            var traced = _this.traceExport(entryModule, exportName);
            var variable = traced.module.traceExport(traced.name);
            _this.exports[exportName] = { module: traced.module, name: traced.name, variable: variable };
            // if we exposed an export in another module ensure it is exported there
            if (traced.module.bundle !== _this && !traced.module.isExternal) {
                traced.module.bundle.ensureExport(traced.module, variable);
            }
            _this.exportedVariables.set(variable, exportName);
        });
    };
    Bundle.prototype.generateDependencies = function (entryFacade) {
        var _this = this;
        if (entryFacade) {
            this.externalModules = [];
            this.dependencies = [entryFacade.bundle];
            return;
        }
        this.externalModules = [];
        this.dependencies = [];
        this.orderedModules.forEach(function (module) {
            module.dependencies.forEach(function (dep) {
                if (dep.bundle === _this) {
                    return;
                }
                var depModule;
                if (dep instanceof Module_1.default) {
                    depModule = dep.bundle;
                }
                else {
                    // unused pure external modules can be skipped
                    if (!dep.used && _this.graph.isPureExternalModule(dep.id)) {
                        return;
                    }
                    depModule = dep;
                }
                if (!_this.dependencies.some(function (dep) { return dep === depModule; })) {
                    _this.dependencies.push(depModule);
                    if (dep.isExternal) {
                        _this.externalModules.push(dep);
                    }
                }
            });
        });
    };
    Bundle.prototype.generateImports = function () {
        var _this = this;
        this.orderedModules.forEach(function (module) {
            object_1.keys(module.imports).forEach(function (importName) {
                var declaration = module.imports[importName];
                var tracedExport = _this.traceExport(declaration.module, declaration.name);
                // ignore imports to modules already in this bundle
                if (!tracedExport || tracedExport.module.bundle === _this) {
                    return;
                }
                var variable = tracedExport.module.traceExport(tracedExport.name);
                // namespace variable can indicate multiple imports
                if (tracedExport.name === '*') {
                    object_1.keys(variable.originals || variable.module.declarations).forEach(function (importName) {
                        var original = (variable.originals || variable.module.declarations)[importName];
                        if (!original.included) {
                            return;
                        }
                        var exportName, importModule;
                        // ensure that the variable is exported by the other bundle to this one
                        if (tracedExport.module instanceof Module_1.default) {
                            importModule = tracedExport.module.bundle;
                            exportName = tracedExport.module.bundle.ensureExport(tracedExport.module, original);
                        }
                        else {
                            importModule = tracedExport.module;
                            exportName = original.name;
                        }
                        var impt = _this.imports.find(function (impt) { return impt.module.id === importModule.id; });
                        if (!impt) {
                            _this.imports.push(impt = { module: importModule, variables: [] });
                        }
                        // if we already import this variable skip
                        if (impt.variables.some(function (v) { return v.module === tracedExport.module && v.variable === original; })) {
                            return;
                        }
                        impt.variables.push({
                            module: tracedExport.module,
                            variable: original,
                            name: exportName[0] === '*' ? '*' : exportName
                        });
                    });
                    return;
                }
                // if the underlying variable is not included, skip it
                if (!variable.included) {
                    return;
                }
                var exportName, importModule;
                // ensure that the variable is exported by the other bundle to this one
                if (tracedExport.module instanceof Module_1.default) {
                    importModule = tracedExport.module.bundle;
                    exportName = tracedExport.module.bundle.ensureExport(tracedExport.module, variable);
                }
                else {
                    importModule = tracedExport.module;
                    exportName = declaration.name;
                }
                var impt = _this.imports.find(function (impt) { return impt.module.id === importModule.id; });
                if (!impt) {
                    _this.imports.push(impt = { module: importModule, variables: [] });
                }
                // if we already import this variable skip
                if (impt.variables.some(function (v) { return v.module === tracedExport.module && v.variable === variable; })) {
                    return;
                }
                impt.variables.push({
                    module: tracedExport.module,
                    variable: variable,
                    name: exportName[0] === '*' ? '*' : exportName
                });
            });
        });
    };
    Bundle.prototype.getImportIds = function () {
        return this.imports.map(function (impt) { return impt.module.id; });
    };
    Bundle.prototype.getExportNames = function () {
        return object_1.keys(this.exports);
    };
    Bundle.prototype.getJsonModules = function () {
        return this.orderedModules.map(function (module) { return module.toJSON(); });
    };
    // trace a module export to its exposed bundle module export
    // either in this bundle or in another
    // we follow reexports if they are not entry points in the hope
    // that we can get an entry point reexport to reduce the chance of
    // tainting an entryModule bundle by exposing other unnecessary exports
    Bundle.prototype.traceExport = function (module, name) {
        if (name === '*') {
            return { name: name, module: module };
        }
        if (module instanceof ExternalModule_1.default) {
            return { name: name, module: module };
        }
        if (module.bundle !== this && module.isEntryPoint) {
            return { name: name, module: module };
        }
        if (module.exports[name]) {
            return { name: name, module: module };
        }
        var reexportDeclaration = module.reexports[name];
        if (reexportDeclaration) {
            return this.traceExport(reexportDeclaration.module, reexportDeclaration.localName);
        }
        if (name === 'default') {
            return;
        }
        for (var i = 0; i < module.exportAllModules.length; i += 1) {
            var exportAllModule = module.exportAllModules[i];
            // we have to ensure the right export all module
            if (name[0] === '*') {
                if (exportAllModule.id === name.substr(1)) {
                    return this.traceExport(exportAllModule, '*');
                }
            }
            else if (exportAllModule.traceExport(name)) {
                return this.traceExport(exportAllModule, name);
            }
        }
    };
    Bundle.prototype.collectAddon = function (initialAddon, addonName, sep) {
        if (sep === void 0) { sep = '\n'; }
        return promise_1.runSequence([{ pluginName: 'rollup', source: initialAddon }]
            .concat(this.graph.plugins.map(function (plugin, idx) {
            return {
                pluginName: plugin.name || "Plugin at pos " + idx,
                source: plugin[addonName]
            };
        }))
            .map(function (addon) {
            addon.source = callIfFunction_1.default(addon.source);
            return addon;
        })
            .filter(function (addon) {
            return addon.source;
        })
            .map(function (_a) {
            var pluginName = _a.pluginName, source = _a.source;
            return Promise.resolve(source).catch(function (err) {
                error_1.default({
                    code: 'ADDON_ERROR',
                    message: "Could not retrieve " + addonName + ". Check configuration of " + pluginName + ".\n\tError Message: " + err.message
                });
            });
        })).then(function (addons) { return addons.filter(Boolean).join(sep); });
    };
    Bundle.prototype.setIdentifierRenderResolutions = function (options) {
        var _this = this;
        var used = object_1.blank();
        var dynamicImportMechanism;
        var es = options.format === 'es';
        if (!es) {
            if (options.format === 'cjs') {
                dynamicImportMechanism = {
                    left: 'Promise.resolve(require(',
                    right: '))'
                };
            }
            else if (options.format === 'amd') {
                dynamicImportMechanism = {
                    left: 'new Promise(function (resolve, reject) { require([',
                    right: '], resolve, reject) })'
                };
            }
        }
        if (this.graph.dynamicImport) {
            this.orderedModules.forEach(function (module) {
                module.dynamicImportResolutions.forEach(function (replacement, index) {
                    var node = module.dynamicImports[index];
                    if (!replacement)
                        return;
                    if (replacement instanceof Module_1.default) {
                        // if we have the module in the bundle, inline as Promise.resolve(namespace)
                        // ensuring that we create a namespace import of it as well
                        if (replacement.bundle === _this) {
                            node.setResolution(replacement.namespace(), { left: 'Promise.resolve().then(() => ', right: ')' });
                            // for the module in another chunk, import that other chunk directly
                        }
                        else {
                            node.setResolution("\"" + replacement.bundle.id + "\"", dynamicImportMechanism);
                        }
                        // external dynamic import resolution
                    }
                    else if (replacement instanceof ExternalModule_1.default) {
                        node.setResolution("\"" + replacement.id + "\"", dynamicImportMechanism);
                        // AST Node -> source replacement
                    }
                    else {
                        node.setResolution(replacement, dynamicImportMechanism);
                    }
                });
            });
        }
        // ensure no conflicts with globals
        object_1.keys(this.graph.scope.variables).forEach(function (name) { return (used[name] = 1); });
        function getSafeName(name) {
            var safeName = name;
            while (used[safeName]) {
                safeName = name + "$" + used[name]++;
            }
            used[safeName] = 1;
            return safeName;
        }
        var toDeshadow = new Set();
        this.externalModules.forEach(function (module) {
            if (!es || module.exportsNamespace) {
                var safeName = getSafeName(module.name);
                toDeshadow.add(safeName);
                module.name = safeName;
            }
        });
        this.imports.forEach(function (impt) {
            impt.variables.forEach(function (_a) {
                var name = _a.name, module = _a.module, variable = _a.variable;
                var safeName;
                if (module.isExternal) {
                    if (variable.name === '*') {
                        safeName = module.name;
                    }
                    else if (variable.name === 'default') {
                        if (module.exportsNamespace || !es && module.exportsNames) {
                            safeName = module.name + "__default";
                        }
                        else {
                            safeName = module.name;
                        }
                    }
                    else {
                        safeName = es ? getSafeName(variable.name) : module.name + "." + name;
                    }
                }
                else if (es) {
                    safeName = getSafeName(variable.name);
                }
                else {
                    safeName = module.bundle.name + "." + name;
                }
                variable.setSafeName(safeName);
            });
        });
        this.orderedModules.forEach(function (module) {
            object_1.forOwn(module.scope.variables, function (variable) {
                if (!variable.isDefault || !variable.hasId) {
                    var safeName = void 0;
                    if (es || !variable.isReassigned) {
                        safeName = getSafeName(variable.name);
                    }
                    else {
                        var safeExportName = _this.exportedVariables.get(variable);
                        if (safeExportName) {
                            safeName = "exports." + safeExportName;
                        }
                        else {
                            safeName = getSafeName(variable.name);
                        }
                    }
                    variable.setSafeName(safeName);
                }
            });
            // deconflict reified namespaces
            var namespace = module.namespace();
            if (namespace.needsNamespaceBlock) {
                namespace.name = getSafeName(namespace.name);
            }
        });
        this.graph.scope.deshadow(toDeshadow, this.orderedModules.map(function (module) { return module.scope; }));
    };
    Bundle.prototype.getModuleDeclarations = function () {
        var _this = this;
        var reexportDeclarations = {};
        for (var name_1 in this.exports) {
            var expt = this.exports[name_1];
            // skip local exports
            if (expt.module.bundle === this)
                continue;
            var depId = void 0;
            if (expt.module.isExternal) {
                depId = expt.module.id;
            }
            else {
                depId = expt.module.bundle.id;
            }
            var exportDeclaration = reexportDeclarations[depId] = reexportDeclarations[depId] || [];
            exportDeclaration.push({
                imported: expt.name,
                reexported: name_1
            });
        }
        var dependencies = [];
        var imports;
        this.dependencies.forEach(function (dep) {
            var importSpecifiers = _this.imports.find(function (impt) { return impt.module === dep; });
            if (importSpecifiers && importSpecifiers.variables.length) {
                imports = [];
                for (var i = 0; i < importSpecifiers.variables.length; i++) {
                    var impt = importSpecifiers.variables[i];
                    imports.push({
                        local: impt.variable.getName(),
                        imported: impt.name
                    });
                }
            }
            var reexports = reexportDeclarations[dep.id];
            dependencies.push({
                id: dep.id,
                name: dep.name,
                isBundle: !dep.isExternal,
                reexports: reexports,
                imports: imports
            });
        });
        var exports = [];
        for (var name_2 in this.exports) {
            var expt = this.exports[name_2];
            // skip external exports
            if (expt.module.bundle !== this)
                continue;
            exports.push({
                local: expt.variable.getName(),
                exported: name_2
            });
        }
        return { dependencies: dependencies, exports: exports };
    };
    Bundle.prototype.render = function (options) {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            return Promise.all([
                _this.collectAddon(options.banner, 'banner'),
                _this.collectAddon(options.footer, 'footer'),
                _this.collectAddon(options.intro, 'intro', '\n\n'),
                _this.collectAddon(options.outro, 'outro', '\n\n')
            ]);
        })
            .then(function (_a) {
            var banner = _a[0], footer = _a[1], intro = _a[2], outro = _a[3];
            // Determine export mode - 'default', 'named', 'none'
            var exportMode = getExportMode_1.default(_this, options);
            var magicString = new magic_string_1.Bundle({ separator: '\n\n' });
            var usedModules = [];
            flushTime_1.timeStart('render modules');
            _this.setIdentifierRenderResolutions(options);
            _this.orderedModules.forEach(function (module) {
                var source = module.render(_this.graph.legacy, options.freeze !== false);
                if (source.toString().length) {
                    magicString.addSource(source);
                    usedModules.push(module);
                }
            });
            if (!magicString.toString().trim() && _this.getExportNames().length === 0) {
                _this.graph.warn({
                    code: 'EMPTY_BUNDLE',
                    message: 'Generated an empty bundle'
                });
            }
            flushTime_1.timeEnd('render modules');
            var indentString = getIndentString_1.default(magicString, options);
            var finalise = index_1.default[options.format];
            if (!finalise) {
                error_1.default({
                    code: 'INVALID_OPTION',
                    message: "Invalid format: " + options.format + " - valid options are " + object_1.keys(index_1.default).join(', ')
                });
            }
            flushTime_1.timeStart('render format');
            var optionsPaths = options.paths;
            var getPath = typeof optionsPaths === 'function'
                ? function (id) { return optionsPaths(id, _this.id) || _this.graph.getPathRelativeToBaseDirname(id, _this.id); }
                : optionsPaths
                    ? function (id) {
                        return optionsPaths.hasOwnProperty(id)
                            ? optionsPaths[id]
                            : _this.graph.getPathRelativeToBaseDirname(id, _this.id);
                    }
                    : function (id) { return _this.graph.getPathRelativeToBaseDirname(id, _this.id); };
            if (intro)
                intro += '\n\n';
            if (outro)
                outro = "\n\n" + outro;
            magicString = finalise(_this, magicString.trim(), // TODO TypeScript: Awaiting MagicString PR
            { exportMode: exportMode, getPath: getPath, indentString: indentString, intro: intro, outro: outro }, options);
            flushTime_1.timeEnd('render format');
            if (banner)
                magicString.prepend(banner + '\n');
            if (footer)
                magicString.append('\n' + footer); // TODO TypeScript: Awaiting MagicString PR
            var prevCode = magicString.toString();
            var map = null;
            var bundleSourcemapChain = [];
            return transformBundle_1.default(prevCode, _this.graph.plugins, bundleSourcemapChain, options).then(function (code) {
                if (options.sourcemap) {
                    flushTime_1.timeStart('sourcemap');
                    var file = options.sourcemapFile || options.file;
                    if (file)
                        file = path_1.resolve(typeof process !== 'undefined' ? process.cwd() : '', file);
                    if (_this.graph.hasLoaders ||
                        array_1.find(_this.graph.plugins, function (plugin) { return Boolean(plugin.transform || plugin.transformBundle); })) {
                        map = magicString.generateMap({}); // TODO TypeScript: Awaiting missing version in SourceMap type
                        if (typeof map.mappings === 'string') {
                            map.mappings = sourcemap_codec_1.decode(map.mappings);
                        }
                        map = collapseSourcemaps_1.default(_this, file, map, usedModules, bundleSourcemapChain);
                    }
                    else {
                        map = magicString.generateMap({ file: file, includeContent: true }); // TODO TypeScript: Awaiting missing version in SourceMap type
                    }
                    map.sources = map.sources.map(path_1.normalize);
                    flushTime_1.timeEnd('sourcemap');
                }
                if (code[code.length - 1] !== '\n')
                    code += '\n';
                return { code: code, map: map }; // TODO TypeScript: Awaiting missing version in SourceMap type
            });
        });
    };
    return Bundle;
}());
exports.default = Bundle;
