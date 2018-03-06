import TemplateElement from './TemplateElement';
import MagicString from 'magic-string';
import { ExpressionNode, Node, NodeBase } from './shared/Node';
import { NodeType } from './NodeType';
import { RenderOptions } from '../../utils/renderHelpers';

export function isTemplateLiteral(node: Node): node is TemplateLiteral {
	return node.type === NodeType.TemplateLiteral;
}

export default class TemplateLiteral extends NodeBase {
	type: NodeType.TemplateLiteral;
	quasis: TemplateElement[];
	expressions: ExpressionNode[];

	eachChild(callback: (node: Node) => void): void {
		for (let i = 0; i < this.quasis.length; i++) callback(this.quasis[i]);
		for (let i = 0; i < this.expressions.length; i++) callback(this.expressions[i]);
	}

	render(code: MagicString, options: RenderOptions) {
		(<any>code).indentExclusionRanges.push([this.start, this.end]); // TODO TypeScript: Awaiting PR
		super.render(code, options);
	}
}
