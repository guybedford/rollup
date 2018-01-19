import Module, { ModuleJSON } from './Module';
import { OutputOptions } from './rollup/index';
import Graph from './Graph';
import ExternalModule from './ExternalModule';
import Variable from './ast/variables/Variable';
export declare type BundleDependencies = {
    id: string;
    name: string;
    isBundle: boolean;
    reexports?: ReexportSpecifier[];
    imports?: ImportSpecifier[];
}[];
export declare type BundleExports = {
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
export default class Bundle {
    id: string;
    name: string;
    graph: Graph;
    orderedModules: Module[];
    exportedVariables: Map<Variable, string>;
    imports: {
        module: Bundle | ExternalModule;
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
    dependencies: (ExternalModule | Bundle)[];
    externalModules: ExternalModule[];
    entryModule: Module;
    entryModuleFacade: boolean;
    constructor(graph: Graph, id: string, orderedModules: Module[]);
    setId(id: string): void;
    ensureExport(module: Module | ExternalModule, variable: Variable): string;
    generateEntryExports(entryModule: Module): void;
    generateDependencies(entryFacade?: Module): void;
    generateImports(): void;
    getImportIds(): string[];
    getExportNames(): string[];
    getJsonModules(): ModuleJSON[];
    traceExport(module: Module | ExternalModule, name: string): {
        name: string;
        module: Module | ExternalModule;
    };
    collectAddon(initialAddon: string, addonName: 'banner' | 'footer' | 'intro' | 'outro', sep?: string): Promise<string>;
    private setIdentifierRenderResolutions(options);
    getModuleDeclarations(): {
        dependencies: {
            id: string;
            name: string;
            isBundle: boolean;
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
