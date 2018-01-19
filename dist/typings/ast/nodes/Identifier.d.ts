import { Node, NodeBase } from './shared/Node';
import Scope from '../scopes/Scope';
import ExecutionPathOptions from '../ExecutionPathOptions';
import Variable from '../variables/Variable';
import CallOptions from '../CallOptions';
import MagicString from 'magic-string';
import { ObjectPath } from '../variables/VariableReassignmentTracker';
import { ExpressionEntity, ForEachReturnExpressionCallback, SomeReturnExpressionCallback } from './shared/Expression';
import { NodeType } from './index';
export declare function isIdentifier(node: Node): node is Identifier;
export default class Identifier extends NodeBase {
    type: NodeType.Identifier;
    name: string;
    variable: Variable;
    private isBound;
    bindNode(): void;
    forEachReturnExpressionWhenCalledAtPath(path: ObjectPath, callOptions: CallOptions, callback: ForEachReturnExpressionCallback, options: ExecutionPathOptions): void;
    hasEffectsWhenAccessedAtPath(path: ObjectPath, options: ExecutionPathOptions): boolean;
    hasEffectsWhenAssignedAtPath(path: ObjectPath, options: ExecutionPathOptions): boolean;
    hasEffectsWhenCalledAtPath(path: ObjectPath, callOptions: CallOptions, options: ExecutionPathOptions): boolean;
    includeInBundle(): boolean;
    initialiseAndDeclare(parentScope: Scope, kind: string, init: ExpressionEntity | null): void;
    reassignPath(path: ObjectPath, options: ExecutionPathOptions): void;
    private disallowImportReassignment();
    render(code: MagicString): void;
    someReturnExpressionWhenCalledAtPath(path: ObjectPath, callOptions: CallOptions, predicateFunction: SomeReturnExpressionCallback, options: ExecutionPathOptions): boolean;
}
