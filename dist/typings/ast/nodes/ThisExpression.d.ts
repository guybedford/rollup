import ThisVariable from '../variables/ThisVariable';
import ExecutionPathOptions from '../ExecutionPathOptions';
import MagicString from 'magic-string';
import { ObjectPath } from '../variables/VariableReassignmentTracker';
import { NodeBase } from './shared/Node';
import { NodeType } from './index';
export default class ThisExpression extends NodeBase {
    type: NodeType.ThisExpression;
    variable: ThisVariable;
    alias: string;
    initialiseNode(): void;
    bindNode(): void;
    hasEffectsWhenAccessedAtPath(path: ObjectPath, options: ExecutionPathOptions): boolean;
    hasEffectsWhenAssignedAtPath(path: ObjectPath, options: ExecutionPathOptions): boolean;
    render(code: MagicString): void;
}
