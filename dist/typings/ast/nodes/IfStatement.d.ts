import Scope from '../scopes/Scope';
import { ExpressionNode } from './shared/Node';
import MagicString from 'magic-string';
import { StatementBase, StatementNode } from './shared/Statement';
import { NodeType } from './index';
export default class IfStatement extends StatementBase {
    type: NodeType.IfStatement;
    test: ExpressionNode;
    consequent: StatementNode;
    alternate: StatementNode | null;
    testValue: any;
    hoistedVars: string[];
    initialiseChildren(parentScope: Scope): void;
    render(code: MagicString): void;
}
