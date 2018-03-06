import ExecutionPathOptions from '../ExecutionPathOptions';
import { NodeType } from './NodeType';
import { ExpressionNode, NodeBase } from './shared/Node';

export default class AwaitExpression extends NodeBase {
	type: NodeType.AwaitExpression;
	argument: ExpressionNode;

	eachChild(callback: (node: ExpressionNode) => void): void {
		callback(this.argument);
	}

	hasEffects(options: ExecutionPathOptions) {
		return super.hasEffects(options) || !options.ignoreReturnAwaitYield();
	}
}
