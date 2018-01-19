import { NodeBase, Node } from './Node';
import MagicString from 'magic-string';
export interface StatementNode extends Node {
}
export declare class StatementBase extends NodeBase implements StatementNode {
    render(code: MagicString): void;
}
