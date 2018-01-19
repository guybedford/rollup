import ExecutionPathOptions from '../ExecutionPathOptions';
import MagicString from 'magic-string';
import { ObjectPath } from '../variables/VariableReassignmentTracker';
import { Node, NodeBase } from './shared/Node';
import { NodeType } from './index';
export declare function isLiteral(node: Node): node is Literal;
export default class Literal<T = string | boolean | null | number | RegExp> extends NodeBase {
    type: NodeType.Literal;
    value: T;
    getValue(): T;
    hasEffectsWhenAccessedAtPath(path: ObjectPath, _options: ExecutionPathOptions): boolean;
    hasEffectsWhenAssignedAtPath(path: ObjectPath, _options: ExecutionPathOptions): boolean;
    render(code: MagicString): void;
}
