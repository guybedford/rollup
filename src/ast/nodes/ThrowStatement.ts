import ExecutionPathOptions from '../ExecutionPathOptions';
import { NodeType } from './NodeType';
import { ExpressionNode, StatementBase } from './shared/Node';

export default class ThrowStatement extends StatementBase {
	type: NodeType.ThrowStatement;
	argument: ExpressionNode;

	eachChild(callback: (node: ExpressionNode) => void): void {
		callback(this.argument);
	}

	hasEffects(_options: ExecutionPathOptions) {
		return true;
	}
}
