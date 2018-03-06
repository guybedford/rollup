import ExecutionPathOptions from '../ExecutionPathOptions';
import Identifier from './Identifier';
import { NodeType } from './NodeType';
import { StatementBase } from './shared/Node';

export default class BreakStatement extends StatementBase {
	type: NodeType.BreakStatement;
	label: Identifier | null;

	eachChild(callback: (node: Identifier) => void): void {
		if (this.label) callback(this.label);
	}

	hasEffects(options: ExecutionPathOptions) {
		return (
			super.hasEffects(options) ||
			!options.ignoreBreakStatements() ||
			(this.label && !options.ignoreLabel(this.label.name))
		);
	}
}
