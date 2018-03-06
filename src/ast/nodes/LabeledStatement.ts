import ExecutionPathOptions from '../ExecutionPathOptions';
import Identifier from './Identifier';
import { NodeType } from './NodeType';
import { StatementBase, StatementNode, Node } from './shared/Node';

export default class LabeledStatement extends StatementBase {
	type: NodeType.LabeledStatement;
	label: Identifier;
	body: StatementNode;

	eachChild(callback: (node: Node) => void): void {
		callback(this.label);
		callback(this.body);
	}

	hasEffects(options: ExecutionPathOptions) {
		return this.body.hasEffects(options.setIgnoreLabel(this.label.name).setIgnoreBreakStatements());
	}
}
