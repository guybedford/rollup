import FunctionNode from './shared/FunctionNode';
import Scope from '../scopes/Scope';
import MagicString from 'magic-string';
import { NodeType } from './index';
export default class FunctionDeclaration extends FunctionNode {
    type: NodeType.FunctionDeclaration;
    initialiseChildren(parentScope: Scope): void;
    render(code: MagicString): void;
}
