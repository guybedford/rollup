import Module, { ModuleJSON } from './Module';
import { OutputOptions } from './rollup/index';
import Graph from './Graph';
import ExternalModule from './ExternalModule';
import Variable from './ast/variables/Variable';
export declare type ChunkDependencies = {
    id: string;
    name: string;
    isChunk: boolean;
    reexports?: ReexportSpecifier[];
    imports?: ImportSpecifier[];
}[];
export declare type ChunkExports = {
    local: string;
    exported: string;
}[];
export interface ReexportSpecifier {
    reexported: string;
    imported: string;
}
export interface ImportSpecifier {
    local: string;
    imported: string;
}
export default class Chunk {
    id: string;
    name: string;
    graph: Graph;
    orderedModules: Module[];
    exportedVariables: Map<Variable, string>;
    imports: {
        module: Chunk | ExternalModule;
        variables: {
            name: string;
            module: Module | ExternalModule;
            variable: Variable;
        }[];
    }[];
    exports: {
        [safeName: string]: {
            module: Module | ExternalModule;
            name: string;
            variable: Variable;
        };
    };
    dependencies: (ExternalModule | Chunk)[];
    externalModules: ExternalModule[];
    entryModule: Module;
    isEntryModuleFacade: boolean;
    constructor(graph: Graph, id: string, orderedModules: Module[]);
    setId(id: string): void;
    ensureExport(module: Module | ExternalModule, variable: Variable): string;
    generateEntryExports(entryModule: Module): void;
    collectDependencies(entryFacade?: Module): void;
    generateImports(): void;
    populateImport(variable: Variable, tracedExport: {
        name: string;
        module: Module | ExternalModule;
    }): void;
    getImportIds(): string[];
    getExportNames(): string[];
    getJsonModules(): ModuleJSON[];
    traceExport(module: Module | ExternalModule, name: string): {
        name: string;
        module: Module | ExternalModule;
    };
    collectAddon(initialAddon: string, addonName: 'banner' | 'footer' | 'intro' | 'outro', sep?: string): Promise<string>;
    private setDynamicImportResolutions(format);
    private setIdentifierRenderResolutions(options);
    getModuleDeclarations(): {
        dependencies: {
            id: string;
            name: string;
            isChunk: boolean;
            reexports?: ReexportSpecifier[];
            imports?: ImportSpecifier[];
        }[];
        exports: {
            local: string;
            exported: string;
        }[];
    };
    render(options: OutputOptions): Promise<{
        code: string;
        map: any;
    }>;
}
