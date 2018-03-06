import MagicString from 'magic-string';
import { NodeBase, StatementNode } from './shared/Node';
import { NodeType } from './NodeType';
import { RenderOptions, renderStatementList } from '../../utils/renderHelpers';

export default class Program extends NodeBase {
	type: NodeType.Program;
	body: StatementNode[];

	eachChild(callback: (node: StatementNode) => void): void {
		for (let i = 0; i < this.body.length; i++) callback(this.body[i]);
	}

	render(code: MagicString, options: RenderOptions) {
		if (this.body.length) {
			renderStatementList(this.body, code, this.start, this.end, options);
		} else {
			super.render(code, options);
		}
	}
}
