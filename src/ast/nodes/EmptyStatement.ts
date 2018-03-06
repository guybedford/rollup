import MagicString from 'magic-string';
import { NodeType } from './NodeType';
import { StatementBase, Node } from './shared/Node';
import { RenderOptions } from '../../utils/renderHelpers';

export default class EmptyStatement extends StatementBase {
	type: NodeType.EmptyStatement;

	eachChild(_callback: (node: Node) => void): void {}

	render(code: MagicString, _options: RenderOptions) {
		if (this.parent.type === NodeType.BlockStatement || this.parent.type === NodeType.Program) {
			code.remove(this.start, this.end);
		}
	}
}
