/// <reference types="node" />
import MagicString from 'magic-string';
import { RollupError } from './utils/error';
import NamespaceVariable from './ast/variables/NamespaceVariable';
import ModuleScope from './ast/scopes/ModuleScope';
import { RawSourceMap } from 'source-map';
import ImportSpecifier from './ast/nodes/ImportSpecifier';
import Graph from './Graph';
import Variable from './ast/variables/Variable';
import Program from './ast/nodes/Program';
import { Node } from './ast/nodes/shared/Node';
import ImportDefaultSpecifier from './ast/nodes/ImportDefaultSpecifier';
import ImportNamespaceSpecifier from './ast/nodes/ImportNamespaceSpecifier';
import { RollupWarning } from './rollup/index';
import ExternalModule from './ExternalModule';
import Import from './ast/nodes/Import';
import Chunk from './Chunk';
export interface IdMap {
    [key: string]: string;
}
export interface CommentDescription {
    block: boolean;
    text: string;
    start: number;
    end: number;
}
export interface ExportDescription {
    localName: string;
    identifier?: string;
}
export interface ReexportDescription {
    localName: string;
    start: number;
    source: string;
    module: Module;
}
export interface ModuleJSON {
    id: string;
    dependencies: string[];
    code: string;
    originalCode: string;
    originalSourcemap: RawSourceMap | void;
    ast: Program;
    sourcemapChain: RawSourceMap[];
    resolvedIds: IdMap;
}
export default class Module {
    type: 'Module';
    graph: Graph;
    code: string;
    comments: CommentDescription[];
    context: string;
    dependencies: (Module | ExternalModule)[];
    excludeFromSourcemap: boolean;
    exports: {
        [name: string]: ExportDescription;
    };
    exportsAll: {
        [name: string]: string;
    };
    exportAllSources: string[];
    id: string;
    imports: {
        [name: string]: {
            source: string;
            specifier: ImportSpecifier | ImportNamespaceSpecifier | ImportDefaultSpecifier;
            name: string;
            module: Module | ExternalModule | null;
        };
    };
    isExternal: false;
    magicString: MagicString;
    originalCode: string;
    originalSourcemap: RawSourceMap | void;
    reexports: {
        [name: string]: ReexportDescription;
    };
    resolvedIds: IdMap;
    scope: ModuleScope;
    sourcemapChain: RawSourceMap[];
    strongDependencies: Module[];
    sources: string[];
    dynamicImports: Import[];
    dynamicImportResolutions: (Module | ExternalModule | string | void)[];
    execIndex: number;
    isEntryPoint: boolean;
    entryPointsHash: Buffer;
    chunk: Chunk;
    ast: Program;
    private astClone;
    declarations: {
        '*'?: NamespaceVariable;
        [name: string]: Variable | undefined;
    };
    exportAllModules: (Module | ExternalModule)[];
    constructor({id, code, originalCode, originalSourcemap, ast, sourcemapChain, resolvedIds, graph}: {
        id: string;
        code: string;
        originalCode: string;
        originalSourcemap: RawSourceMap;
        ast: Program;
        sourcemapChain: RawSourceMap[];
        resolvedIds: IdMap;
        resolvedExternalIds?: IdMap;
        graph: Graph;
    });
    private addExport(node);
    private addImport(node);
    private analyse();
    basename(): string;
    markExports(): void;
    linkDependencies(): void;
    bindReferences(): void;
    getDynamicImportExpressions(): (string | Node)[];
    private getOriginalLocation(sourcemapChain, line, column);
    error(props: RollupError, pos: number): void;
    getAllExports(): string[];
    getExports(): string[];
    getReexports(): string[];
    includeAllInBundle(): void;
    includeInBundle(): boolean;
    namespace(): NamespaceVariable;
    render(legacy: boolean, freeze: boolean): MagicString;
    toJSON(): ModuleJSON;
    trace(name: string): Variable;
    traceExport(name: string): Variable;
    warn(warning: RollupWarning, pos: number): void;
}
