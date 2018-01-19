import { NodeBase } from './shared/Node';
import Literal from './Literal';
import MagicString from 'magic-string';
import { NodeType } from './index';
export default class ExportAllDeclaration extends NodeBase {
    type: NodeType.ExportAllDeclaration;
    source: Literal<string>;
    isExportDeclaration: true;
    initialiseNode(): void;
    render(code: MagicString): void;
}
