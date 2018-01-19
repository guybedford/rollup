import { NodeBase } from './shared/Node';
import ExecutionPathOptions from '../ExecutionPathOptions';
import Literal from './Literal';
import MagicString from 'magic-string';
import ExportSpecifier from './ExportSpecifier';
import FunctionDeclaration from './FunctionDeclaration';
import ClassDeclaration from './ClassDeclaration';
import VariableDeclaration from './VariableDeclaration';
import { NodeType } from './index';
export default class ExportNamedDeclaration extends NodeBase {
    type: NodeType.ExportNamedDeclaration;
    declaration: FunctionDeclaration | ClassDeclaration | VariableDeclaration | null;
    specifiers: ExportSpecifier[];
    source: Literal<string> | null;
    isExportDeclaration: true;
    bindChildren(): void;
    hasEffects(options: ExecutionPathOptions): boolean;
    initialiseNode(): void;
    render(code: MagicString): void;
}
