import ExecutionPathOptions from '../ExecutionPathOptions';
import Scope from '../scopes/Scope';
import MagicString from 'magic-string';
import { Node } from './shared/Node';
import { StatementBase, StatementNode } from './shared/Statement';
import { NodeType } from './index';
export declare function isBlockStatement(node: Node): node is BlockStatement;
export default class BlockStatement extends StatementBase {
    type: NodeType.BlockStatement;
    scope: Scope;
    body: StatementNode[];
    bindImplicitReturnExpressionToScope(): void;
    hasEffects(options: ExecutionPathOptions): boolean;
    includeInBundle(): boolean;
    initialiseAndReplaceScope(scope: Scope): void;
    initialiseChildren(_parentScope: Scope): void;
    initialiseScope(parentScope: Scope): void;
    render(code: MagicString): void;
}
