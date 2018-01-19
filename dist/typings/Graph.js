"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./Graph.d.ts" />
var flushTime_1 = require("./utils/flushTime");
var first_1 = require("./utils/first");
var object_1 = require("./utils/object");
var Module_1 = require("./Module");
var ExternalModule_1 = require("./ExternalModule");
var ensureArray_1 = require("./utils/ensureArray");
var defaults_1 = require("./utils/defaults");
var promise_1 = require("./utils/promise");
var transform_1 = require("./utils/transform");
var relativeId_1 = require("./utils/relativeId");
var error_1 = require("./utils/error");
var path_1 = require("./utils/path");
var Chunk_1 = require("./Chunk");
var path = require("./utils/path");
var GlobalScope_1 = require("./ast/scopes/GlobalScope");
var buffer_xor_1 = require("buffer-xor");
var crypto = require("crypto");
function generateUniqueEntryPointChunkName(id, curEntryChunkNames) {
    // entry point chunks are named by the entry point itself, with deduping
    var entryName = path.basename(id);
    var ext = path.extname(entryName);
    entryName = entryName.substr(0, entryName.length - ext.length);
    if (ext !== '.js' && ext !== '.mjs') {
        entryName += ext;
        ext = '.js';
    }
    var uniqueEntryName = entryName;
    var uniqueIndex = 1;
    while (curEntryChunkNames.indexOf(uniqueEntryName) !== -1)
        uniqueEntryName = entryName + ++uniqueIndex + ext;
    return uniqueEntryName + ext;
}
var Graph = /** @class */ (function () {
    function Graph(options) {
        var _this = this;
        this.cachedModules = new Map();
        if (options.cache) {
            options.cache.modules.forEach(function (module) {
                _this.cachedModules.set(module.id, module);
            });
        }
        delete options.cache; // TODO not deleting it here causes a memory leak; needs further investigation
        this.plugins = ensureArray_1.default(options.plugins);
        options = this.plugins.reduce(function (acc, plugin) {
            if (plugin.options)
                return plugin.options(acc) || acc;
            return acc;
        }, options);
        if (!options.input) {
            throw new Error('You must supply options.input to rollup');
        }
        this.treeshake = options.treeshake !== false;
        if (this.treeshake) {
            this.treeshakingOptions = {
                propertyReadSideEffects: options.treeshake
                    ? options.treeshake.propertyReadSideEffects !== false
                    : true,
                pureExternalModules: options.treeshake
                    ? options.treeshake.pureExternalModules
                    : false
            };
            if (this.treeshakingOptions.pureExternalModules === true) {
                this.isPureExternalModule = function () { return true; };
            }
            else if (typeof this.treeshakingOptions.pureExternalModules === 'function') {
                this.isPureExternalModule = this.treeshakingOptions.pureExternalModules;
            }
            else if (Array.isArray(this.treeshakingOptions.pureExternalModules)) {
                var pureExternalModules_1 = new Set(this.treeshakingOptions.pureExternalModules);
                this.isPureExternalModule = function (id) { return pureExternalModules_1.has(id); };
            }
            else {
                this.isPureExternalModule = function () { return false; };
            }
        }
        else {
            this.isPureExternalModule = function () { return false; };
        }
        this.resolveId = first_1.default([(function (id, parentId) { return (_this.isExternal(id, parentId, false) ? false : null); })]
            .concat(this.plugins.map(function (plugin) { return plugin.resolveId; }).filter(Boolean))
            .concat(defaults_1.resolveId));
        var loaders = this.plugins.map(function (plugin) { return plugin.load; }).filter(Boolean);
        this.hasLoaders = loaders.length !== 0;
        this.load = first_1.default(loaders.concat(defaults_1.load));
        this.scope = new GlobalScope_1.default();
        // TODO strictly speaking, this only applies with non-ES6, non-default-only bundles
        ['module', 'exports', '_interopDefault'].forEach(function (name) {
            _this.scope.findVariable(name); // creates global variable as side-effect
        });
        this.moduleById = new Map();
        this.modules = [];
        this.externalModules = [];
        this.context = String(options.context);
        var optionsModuleContext = options.moduleContext;
        if (typeof optionsModuleContext === 'function') {
            this.getModuleContext = function (id) { return optionsModuleContext(id) || _this.context; };
        }
        else if (typeof optionsModuleContext === 'object') {
            var moduleContext_1 = new Map();
            Object.keys(optionsModuleContext).forEach(function (key) { return moduleContext_1.set(path_1.resolve(key), optionsModuleContext[key]); });
            this.getModuleContext = function (id) { return moduleContext_1.get(id) || _this.context; };
        }
        else {
            this.getModuleContext = function () { return _this.context; };
        }
        if (typeof options.external === 'function') {
            this.isExternal = options.external;
        }
        else {
            var ids_1 = ensureArray_1.default(options.external);
            this.isExternal = function (id) { return ids_1.indexOf(id) !== -1; };
        }
        this.onwarn = options.onwarn || defaults_1.makeOnwarn();
        this.varOrConst = options.preferConst ? 'const' : 'var';
        this.legacy = options.legacy;
        this.acornOptions = options.acorn || {};
        this.dynamicImport = typeof options.experimentalDynamicImport === 'boolean' ? options.experimentalDynamicImport : false;
        if (this.dynamicImport) {
            this.resolveDynamicImport = first_1.default(this.plugins.map(function (plugin) { return plugin.resolveDynamicImport; }).filter(Boolean).concat([
                (function (specifier, parentId) { return typeof specifier === 'string' && _this.resolveId(specifier, parentId); })
            ]));
            this.acornOptions.plugins = this.acornOptions.plugins || {};
            this.acornOptions.plugins.dynamicImport = true;
        }
    }
    Graph.prototype.getPathRelativeToBaseDirname = function (resolvedId, parentId) {
        if (path_1.isRelative(resolvedId) || path_1.isAbsolute(resolvedId)) {
            var relativeToEntry = path_1.normalize(path_1.relative(path.dirname(parentId), resolvedId));
            return path_1.isRelative(relativeToEntry)
                ? relativeToEntry
                : "./" + relativeToEntry;
        }
        return resolvedId;
    };
    Graph.prototype.loadModule = function (entryName) {
        var _this = this;
        return this.resolveId(entryName, undefined)
            .then(function (id) {
            if (id === false) {
                error_1.default({
                    code: 'UNRESOLVED_ENTRY',
                    message: "Entry module cannot be external"
                });
            }
            if (id == null) {
                error_1.default({
                    code: 'UNRESOLVED_ENTRY',
                    message: "Could not resolve entry (" + entryName + ")"
                });
            }
            return _this.fetchModule(id, undefined);
        });
    };
    Graph.prototype.link = function () {
        var _this = this;
        this.stronglyDependsOn = object_1.blank();
        this.dependsOn = object_1.blank();
        this.modules.forEach(function (module) {
            module.linkDependencies();
            _this.stronglyDependsOn[module.id] = object_1.blank();
            _this.dependsOn[module.id] = object_1.blank();
        });
        this.modules.forEach(function (module) {
            var processStrongDependency = function (dependency) {
                if (dependency.isExternal)
                    return;
                if (dependency === module ||
                    _this.stronglyDependsOn[module.id][dependency.id])
                    return;
                _this.stronglyDependsOn[module.id][dependency.id] = true;
                dependency.strongDependencies.forEach(processStrongDependency);
            };
            var processDependency = function (dependency) {
                if (dependency.isExternal)
                    return;
                if (dependency === module || _this.dependsOn[module.id][dependency.id])
                    return;
                _this.dependsOn[module.id][dependency.id] = true;
                dependency.dependencies.forEach(processDependency);
            };
            module.strongDependencies.forEach(processStrongDependency);
            module.dependencies.forEach(processDependency);
        });
        this.modules.forEach(function (module) {
            module.bindReferences();
        });
    };
    Graph.prototype.includeMarked = function (modules) {
        if (this.treeshake) {
            var addedNewNodes_1;
            do {
                addedNewNodes_1 = false;
                modules.forEach(function (module) {
                    if (module.includeInBundle()) {
                        addedNewNodes_1 = true;
                    }
                });
            } while (addedNewNodes_1);
        }
        else {
            // Necessary to properly replace namespace imports
            modules.forEach(function (module) { return module.includeAllInBundle(); });
        }
    };
    Graph.prototype.buildSingle = function (entryModuleId) {
        var _this = this;
        // Phase 1 – discovery. We load the entry module and find which
        // modules it imports, and import those, until we have all
        // of the entry module's dependencies
        flushTime_1.timeStart('phase 1');
        return this.loadModule(entryModuleId)
            .then(function (entryModule) {
            flushTime_1.timeEnd('phase 1');
            // Phase 2 - linking. We populate the module dependency links and
            // determine the topological execution order for the bundle
            flushTime_1.timeStart('phase 2');
            _this.link();
            var _a = _this.analyseExecution([entryModule]), orderedModules = _a.orderedModules, dynamicImports = _a.dynamicImports, hasCycles = _a.hasCycles;
            if (hasCycles) {
                _this.warnCycle(entryModule, orderedModules);
            }
            flushTime_1.timeEnd('phase 2');
            // Phase 3 – marking. We include all statements that should be included
            flushTime_1.timeStart('phase 3');
            entryModule.markExports();
            dynamicImports.forEach(function (dynamicImportModule) {
                if (entryModule !== dynamicImportModule)
                    dynamicImportModule.markExports();
                // all dynamic import modules inlined for single-file build
                dynamicImportModule.namespace().includeVariable();
            });
            // only include statements that should appear in the bundle
            _this.includeMarked(orderedModules);
            // check for unused external imports
            _this.externalModules.forEach(function (module) { return module.warnUnusedImports(); });
            flushTime_1.timeEnd('phase 3');
            // Phase 4 – we construct the chunk itself, generating its import and export facades
            flushTime_1.timeStart('phase 4');
            // generate the imports and exports for the output chunk file
            var chunk = new Chunk_1.default(_this, entryModule.id, orderedModules);
            chunk.collectDependencies();
            chunk.generateImports();
            chunk.generateEntryExports(entryModule);
            flushTime_1.timeEnd('phase 4');
            return chunk;
        });
    };
    Graph.prototype.buildChunks = function (entryModuleIds) {
        var _this = this;
        // Phase 1 – discovery. We load the entry module and find which
        // modules it imports, and import those, until we have all
        // of the entry module's dependencies
        flushTime_1.timeStart('phase 1');
        return Promise.all(entryModuleIds.map(function (entryId) { return _this.loadModule(entryId); }))
            .then(function (entryModules) {
            flushTime_1.timeEnd('phase 1');
            // Phase 2 - linking. We populate the module dependency links and
            // determine the topological execution order for the bundle
            flushTime_1.timeStart('phase 2');
            _this.link();
            var _a = _this.analyseExecution(entryModules), orderedModules = _a.orderedModules, dynamicImports = _a.dynamicImports;
            dynamicImports.forEach(function (dynamicImportModule) {
                if (entryModules.indexOf(dynamicImportModule) === -1)
                    entryModules.push(dynamicImportModule);
            });
            // Phase 3 – marking. We include all statements that should be included
            flushTime_1.timeStart('phase 3');
            entryModules.forEach(function (entryModule) {
                entryModule.markExports();
            });
            // only include statements that should appear in the bundle
            _this.includeMarked(orderedModules);
            // check for unused external imports
            _this.externalModules.forEach(function (module) { return module.warnUnusedImports(); });
            flushTime_1.timeEnd('phase 3');
            // Phase 4 – we construct the chunks, working out the optimal chunking using
            // entry point graph colouring, before generating the import and export facades
            flushTime_1.timeStart('phase 4');
            // TODO: there is one special edge case unhandled here and that is that any module
            //       exposed as an unresolvable export * (to a graph external export *,
            //       either as a namespace import reexported or top-level export *)
            //       should be made to be its own entry point module before chunking
            var chunkModules = {};
            orderedModules.forEach(function (module) {
                var entryPointsHashStr = module.entryPointsHash.toString('hex');
                var curChunk = chunkModules[entryPointsHashStr];
                if (curChunk) {
                    curChunk.push(module);
                }
                else {
                    chunkModules[entryPointsHashStr] = [module];
                }
            });
            // create each chunk
            var chunkList = [];
            Object.keys(chunkModules).forEach(function (entryHashSum) {
                var chunk = chunkModules[entryHashSum];
                var chunkModulesOrdered = chunk.sort(function (moduleA, moduleB) { return moduleA.execIndex > moduleB.execIndex ? 1 : -1; });
                chunkList.push(new Chunk_1.default(_this, "./chunk-" + entryHashSum.substr(0, 8) + ".js", chunkModulesOrdered));
            });
            // finally prepare output chunks
            var chunks = {};
            var entryChunkNames = [];
            // for each entry point module, ensure its exports
            // are exported by the chunk itself, with safe name deduping
            entryModules.forEach(function (entryModule) {
                entryModule.chunk.generateEntryExports(entryModule);
            });
            // for each chunk module, set up its imports to other
            // chunks, if those variables are included after treeshaking
            chunkList.forEach(function (chunk) {
                chunk.collectDependencies();
                chunk.generateImports();
            });
            chunkList.forEach(function (chunk) {
                // generate the imports and exports for the output chunk file
                if (chunk.entryModule) {
                    var entryName = generateUniqueEntryPointChunkName(chunk.entryModule.id, entryChunkNames);
                    // if the chunk exactly exports the entry point exports then
                    // it can replace the entry point
                    if (chunk.isEntryModuleFacade) {
                        chunks['./' + entryName] = chunk;
                        chunk.setId('./' + entryName);
                        // otherwise we create a special re-exporting entry point
                        // facade chunk with no modules
                    }
                    else {
                        var entryPointFacade = new Chunk_1.default(_this, './' + entryName, []);
                        entryPointFacade.generateEntryExports(chunk.entryModule);
                        entryPointFacade.collectDependencies(chunk.entryModule);
                        entryPointFacade.generateImports();
                        chunks['./' + entryName] = entryPointFacade;
                        chunks[chunk.id] = chunk;
                    }
                }
                else {
                    chunks[chunk.id] = chunk;
                }
            });
            flushTime_1.timeEnd('phase 4');
            return chunks;
        });
    };
    Graph.prototype.analyseExecution = function (entryModules) {
        var _this = this;
        var hasCycles = false, curEntry, curEntryHash;
        var allSeen = {};
        var ordered = [];
        var dynamicImports = [];
        var visit = function (module, seen) {
            if (seen === void 0) { seen = {}; }
            if (seen[module.id]) {
                hasCycles = true;
                return;
            }
            seen[module.id] = true;
            if (module.isEntryPoint && module !== curEntry)
                return;
            // Track entry point graph colouring by tracing all modules loaded by a given
            // entry point and colouring those modules by the hash of its id. Colours are mixed as
            // hash xors, providing the unique colouring of the graph into unique hash chunks.
            // This is really all there is to automated chunking, the rest is chunk wiring.
            if (module.entryPointsHash)
                module.entryPointsHash = buffer_xor_1.default(module.entryPointsHash, curEntryHash);
            else
                module.entryPointsHash = curEntryHash;
            module.dependencies.forEach(function (depModule) {
                if (!depModule.isExternal) {
                    visit(depModule, seen);
                }
            });
            if (_this.dynamicImport) {
                module.dynamicImportResolutions.forEach(function (module) {
                    if (module instanceof Module_1.default) {
                        if (dynamicImports.indexOf(module) === -1) {
                            dynamicImports.push(module);
                        }
                    }
                });
            }
            if (allSeen[module.id])
                return;
            allSeen[module.id] = true;
            module.execIndex = ordered.length;
            ordered.push(module);
        };
        for (var i = 0; i < entryModules.length; i++) {
            curEntry = entryModules[i];
            curEntry.isEntryPoint = true;
            curEntryHash = crypto.createHash('md5').update(relativeId_1.default(curEntry.id)).digest();
            visit(curEntry);
        }
        // new items can be added during this loop
        for (var i = 0; i < dynamicImports.length; i++) {
            curEntry = dynamicImports[i];
            curEntry.isEntryPoint = true;
            curEntryHash = crypto.createHash('md5').update(relativeId_1.default(curEntry.id)).digest();
            visit(curEntry);
        }
        return { orderedModules: ordered, dynamicImports: dynamicImports, hasCycles: hasCycles };
    };
    Graph.prototype.warnCycle = function (entryModule, ordered) {
        var _this = this;
        ordered.forEach(function (a, i) {
            var _loop_1 = function () {
                var b = ordered[i];
                // TODO reinstate this! it no longer works
                if (_this.stronglyDependsOn[a.id][b.id]) {
                    // somewhere, there is a module that imports b before a. Because
                    // b imports a, a is placed before b. We need to find the module
                    // in question, so we can provide a useful error message
                    var parent_1 = '[[unknown]]';
                    var visited_1 = {};
                    var findParent_1 = function (module) {
                        if (_this.dependsOn[module.id][a.id] && _this.dependsOn[module.id][b.id]) {
                            parent_1 = module.id;
                            return true;
                        }
                        visited_1[module.id] = true;
                        for (var i_1 = 0; i_1 < module.dependencies.length; i_1 += 1) {
                            var dependency = module.dependencies[i_1];
                            if (dependency.isExternal)
                                continue;
                            if (!visited_1[dependency.id] && findParent_1(dependency))
                                return true;
                        }
                    };
                    findParent_1(entryModule);
                    _this.onwarn("Module " + a.id + " may be unable to evaluate without " + b.id + ", but is included first due to a cyclical dependency. Consider swapping the import statements in " + parent_1 + " to ensure correct ordering");
                }
            };
            for (i += 1; i < ordered.length; i += 1) {
                _loop_1();
            }
        });
    };
    Graph.prototype.fetchModule = function (id, importer) {
        var _this = this;
        // short-circuit cycles
        var existingModule = this.moduleById.get(id);
        if (existingModule) {
            if (existingModule.isExternal)
                throw new Error("Cannot fetch external module " + id);
            return Promise.resolve(existingModule);
        }
        this.moduleById.set(id, null);
        return this.load(id)
            .catch(function (err) {
            var msg = "Could not load " + id;
            if (importer)
                msg += " (imported by " + importer + ")";
            msg += ": " + err.message;
            throw new Error(msg);
        })
            .then(function (source) {
            if (typeof source === 'string')
                return source;
            if (source && typeof source === 'object' && source.code)
                return source;
            // TODO report which plugin failed
            error_1.default({
                code: 'BAD_LOADER',
                message: "Error loading " + relativeId_1.default(id) + ": plugin load hook should return a string, a { code, map } object, or nothing/null"
            });
        })
            .then(function (source) {
            var sourceDescription = typeof source === 'string' ? {
                code: source,
                ast: null
            } : source;
            if (_this.cachedModules.has(id) &&
                _this.cachedModules.get(id).originalCode === sourceDescription.code) {
                return _this.cachedModules.get(id);
            }
            return transform_1.default(_this, sourceDescription, id, _this.plugins);
        })
            .then(function (source) {
            var code = source.code, originalCode = source.originalCode, originalSourcemap = source.originalSourcemap, ast = source.ast, sourcemapChain = source.sourcemapChain, resolvedIds = source.resolvedIds;
            var module = new Module_1.default({
                id: id,
                code: code,
                originalCode: originalCode,
                originalSourcemap: originalSourcemap,
                ast: ast,
                sourcemapChain: sourcemapChain,
                resolvedIds: resolvedIds,
                graph: _this
            });
            _this.modules.push(module);
            _this.moduleById.set(id, module);
            return _this.fetchAllDependencies(module).then(function () {
                object_1.keys(module.exports).forEach(function (name) {
                    if (name !== 'default') {
                        module.exportsAll[name] = module.id;
                    }
                });
                module.exportAllSources.forEach(function (source) {
                    var id = module.resolvedIds[source];
                    var exportAllModule = _this.moduleById.get(id);
                    if (exportAllModule.isExternal)
                        return;
                    object_1.keys(exportAllModule.exportsAll).forEach(function (name) {
                        if (name in module.exportsAll) {
                            _this.warn({
                                code: 'NAMESPACE_CONFLICT',
                                reexporter: module.id,
                                name: name,
                                sources: [
                                    module.exportsAll[name],
                                    exportAllModule.exportsAll[name]
                                ],
                                message: "Conflicting namespaces: " + relativeId_1.default(module.id) + " re-exports '" + name + "' from both " + relativeId_1.default(module.exportsAll[name]) + " and " + relativeId_1.default(exportAllModule.exportsAll[name]) + " (will be ignored)"
                            });
                        }
                        else {
                            module.exportsAll[name] = exportAllModule.exportsAll[name];
                        }
                    });
                });
                return module;
            });
        });
    };
    Graph.prototype.fetchAllDependencies = function (module) {
        var _this = this;
        // resolve and fetch dynamic imports where possible
        var fetchDynamicImportsPromise = !this.dynamicImport ? Promise.resolve() : Promise.all(module.getDynamicImportExpressions()
            .map(function (dynamicImportExpression, index) {
            return Promise.resolve(_this.resolveDynamicImport(dynamicImportExpression, module.id))
                .then(function (replacement) {
                if (!replacement) {
                    module.dynamicImportResolutions[index] = null;
                }
                else if (typeof dynamicImportExpression !== 'string') {
                    module.dynamicImportResolutions[index] = replacement;
                }
                else if (_this.isExternal(replacement, module.id, true)) {
                    var externalModule = void 0;
                    if (!_this.moduleById.has(replacement)) {
                        externalModule = new ExternalModule_1.default({ graph: _this, id: replacement });
                        _this.externalModules.push(externalModule);
                        _this.moduleById.set(replacement, module);
                    }
                    else {
                        externalModule = _this.moduleById.get(replacement);
                    }
                    module.dynamicImportResolutions[index] = externalModule;
                    externalModule.exportsNamespace = true;
                }
                else {
                    return _this.fetchModule(replacement, module.id)
                        .then(function (depModule) {
                        module.dynamicImportResolutions[index] = depModule;
                    });
                }
            });
        }))
            .then(function () { });
        fetchDynamicImportsPromise.catch(function () { });
        return promise_1.mapSequence(module.sources, function (source) {
            var resolvedId = module.resolvedIds[source];
            return (resolvedId
                ? Promise.resolve(resolvedId)
                : _this.resolveId(source, module.id)).then(function (resolvedId) {
                // TODO types of `resolvedId` are not compatable with 'externalId'.
                // `this.resolveId` returns `string`, `void`, and `boolean`
                var externalId = resolvedId || (path_1.isRelative(source) ? path_1.resolve(module.id, '..', source) : source);
                var isExternal = _this.isExternal(externalId, module.id, true);
                if (!resolvedId && !isExternal) {
                    if (path_1.isRelative(source)) {
                        error_1.default({
                            code: 'UNRESOLVED_IMPORT',
                            message: "Could not resolve '" + source + "' from " + relativeId_1.default(module.id)
                        });
                    }
                    if (resolvedId !== false) {
                        _this.warn({
                            code: 'UNRESOLVED_IMPORT',
                            source: source,
                            importer: relativeId_1.default(module.id),
                            message: "'" + source + "' is imported by " + relativeId_1.default(module.id) + ", but could not be resolved \u2013 treating it as an external dependency",
                            url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency'
                        });
                    }
                    isExternal = true;
                }
                if (isExternal) {
                    module.resolvedIds[source] = externalId;
                    if (!_this.moduleById.has(externalId)) {
                        var module_1 = new ExternalModule_1.default({ graph: _this, id: externalId });
                        _this.externalModules.push(module_1);
                        _this.moduleById.set(externalId, module_1);
                    }
                    var externalModule_1 = _this.moduleById.get(externalId);
                    // add external declarations so we can detect which are never used
                    Object.keys(module.imports).forEach(function (name) {
                        var importDeclaration = module.imports[name];
                        if (importDeclaration.source !== source)
                            return;
                        externalModule_1.traceExport(importDeclaration.name);
                    });
                }
                else {
                    module.resolvedIds[source] = resolvedId;
                    return _this.fetchModule(resolvedId, module.id);
                }
            });
        })
            .then(function () { return fetchDynamicImportsPromise; });
    };
    Graph.prototype.warn = function (warning) {
        warning.toString = function () {
            var str = '';
            if (warning.plugin)
                str += "(" + warning.plugin + " plugin) ";
            if (warning.loc)
                str += relativeId_1.default(warning.loc.file) + " (" + warning.loc.line + ":" + warning.loc.column + ") ";
            str += warning.message;
            return str;
        };
        this.onwarn(warning);
    };
    return Graph;
}());
exports.default = Graph;
