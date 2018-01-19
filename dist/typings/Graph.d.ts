/// <reference path="../../src/Graph.d.ts" />
import Module, { ModuleJSON } from './Module';
import ExternalModule from './ExternalModule';
import { InputOptions, IsExternalHook, Plugin, RollupWarning, SourceDescription, TreeshakingOptions, WarningHandler } from './rollup/index';
import { Node } from './ast/nodes/shared/Node';
import Chunk from './Chunk';
import GlobalScope from './ast/scopes/GlobalScope';
export declare type ResolveDynamicImportHandler = (specifier: string | Node, parentId: string) => Promise<string | void>;
export default class Graph {
    acornOptions: any;
    cachedModules: Map<string, ModuleJSON>;
    context: string;
    dynamicImport: boolean;
    externalModules: ExternalModule[];
    getModuleContext: (id: string) => string;
    hasLoaders: boolean;
    isExternal: IsExternalHook;
    isPureExternalModule: (id: string) => boolean;
    legacy: boolean;
    load: (id: string) => Promise<SourceDescription | string | void>;
    moduleById: Map<string, Module | ExternalModule>;
    modules: Module[];
    onwarn: WarningHandler;
    plugins: Plugin[];
    resolveDynamicImport: ResolveDynamicImportHandler;
    resolveId: (id: string, parent: string) => Promise<string | boolean | void>;
    scope: GlobalScope;
    treeshakingOptions: TreeshakingOptions;
    varOrConst: 'var' | 'const';
    dependsOn: {
        [id: string]: {
            [id: string]: boolean;
        };
    };
    stronglyDependsOn: {
        [id: string]: {
            [id: string]: boolean;
        };
    };
    treeshake: boolean;
    constructor(options: InputOptions);
    getPathRelativeToBaseDirname(resolvedId: string, parentId: string): string;
    private loadModule(entryName);
    private link();
    includeMarked(modules: Module[]): void;
    buildSingle(entryModuleId: string): Promise<Chunk>;
    buildChunks(entryModuleIds: string[]): Promise<{
        [name: string]: Chunk;
    }>;
    private analyseExecution(entryModules);
    private warnCycle(entryModule, ordered);
    private fetchModule(id, importer);
    private fetchAllDependencies(module);
    warn(warning: RollupWarning): void;
}
