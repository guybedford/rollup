import ClassNode from './shared/ClassNode';
import Scope from '../scopes/Scope';
import Identifier from './Identifier';
import MagicString from 'magic-string';
import { NodeType } from './index';
export default class ClassDeclaration extends ClassNode {
    type: NodeType.ClassDeclaration;
    id: Identifier;
    initialiseChildren(parentScope: Scope): void;
    render(code: MagicString): void;
}
