import ExecutionPathOptions from '../ExecutionPathOptions';
import { NodeType } from './NodeType';
import { ExpressionNode, NodeBase } from './shared/Node';

export default class YieldExpression extends NodeBase {
	type: NodeType.YieldExpression;
	argument: ExpressionNode | null;
	delegate: boolean;

	eachChild(callback: (node: ExpressionNode) => void): void {
		if (this.argument) callback(this.argument);
	}

	hasEffects(options: ExecutionPathOptions) {
		return super.hasEffects(options) || !options.ignoreReturnAwaitYield();
	}
}
