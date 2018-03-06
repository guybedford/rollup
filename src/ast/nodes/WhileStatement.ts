import ExecutionPathOptions from '../ExecutionPathOptions';
import { NodeType } from './NodeType';
import { ExpressionNode, StatementBase, StatementNode } from './shared/Node';

export default class WhileStatement extends StatementBase {
	type: NodeType.WhileStatement;
	test: ExpressionNode;
	body: StatementNode;

	eachChild(callback: (node: ExpressionNode | StatementNode) => void): void {
		callback(this.test);
		callback(this.body);
	}

	hasEffects(options: ExecutionPathOptions): boolean {
		return (
			this.test.hasEffects(options) || this.body.hasEffects(options.setIgnoreBreakStatements())
		);
	}
}
