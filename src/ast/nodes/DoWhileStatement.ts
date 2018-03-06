import ExecutionPathOptions from '../ExecutionPathOptions';
import { ExpressionNode, StatementNode, StatementBase } from './shared/Node';
import { NodeType } from './NodeType';

export default class DoWhileStatement extends StatementBase {
	type: NodeType.DoWhileStatement;
	body: StatementNode;
	test: ExpressionNode;

	eachChild(callback: (node: StatementNode | ExpressionNode) => void): void {
		callback(this.test);
		callback(this.body);
	}

	hasEffects(options: ExecutionPathOptions): boolean {
		return (
			this.test.hasEffects(options) || this.body.hasEffects(options.setIgnoreBreakStatements())
		);
	}
}
