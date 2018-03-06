import { NodeBase, Node } from './shared/Node';
import ExecutionPathOptions from '../ExecutionPathOptions';
import { NodeType } from './NodeType';

export default class TemplateElement extends NodeBase {
	type: NodeType.TemplateElement;
	tail: boolean;
	value: {
		cooked: string;
		raw: string;
	};

	eachChild(_callback: (node: Node) => void): void {}

	hasEffects(_options: ExecutionPathOptions) {
		return false;
	}
}
