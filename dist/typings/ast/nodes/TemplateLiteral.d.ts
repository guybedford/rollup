import TemplateElement from './TemplateElement';
import MagicString from 'magic-string';
import { Node, ExpressionNode, NodeBase } from './shared/Node';
import { NodeType } from './index';
export declare function isTemplateLiteral(node: Node): node is TemplateLiteral;
export default class TemplateLiteral extends NodeBase {
    type: NodeType.TemplateLiteral;
    quasis: TemplateElement[];
    expressions: ExpressionNode[];
    render(code: MagicString): void;
}
