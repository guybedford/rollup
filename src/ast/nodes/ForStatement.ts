import BlockScope from '../scopes/BlockScope';
import VariableDeclaration from './VariableDeclaration';
import ExecutionPathOptions from '../ExecutionPathOptions';
import Scope from '../scopes/Scope';
import { NodeType } from './NodeType';
import { ExpressionNode, Node, StatementBase, StatementNode } from './shared/Node';
import MagicString from 'magic-string';
import { NO_SEMICOLON, RenderOptions } from '../../utils/renderHelpers';

export function isForStatement(node: Node): node is ForStatement {
	return node.type === NodeType.ForStatement;
}

export default class ForStatement extends StatementBase {
	type: NodeType.ForStatement;
	init: VariableDeclaration | ExpressionNode | null;
	test: ExpressionNode | null;
	update: ExpressionNode | null;
	body: StatementNode;

	eachChild(callback: (node: Node) => void): void {
		if (this.init) callback(this.init);
		if (this.test) callback(this.test);
		if (this.update) callback(this.update);
		callback(this.body);
	}

	hasEffects(options: ExecutionPathOptions): boolean {
		return (
			(this.init && this.init.hasEffects(options)) ||
			(this.test && this.test.hasEffects(options)) ||
			(this.update && this.update.hasEffects(options)) ||
			this.body.hasEffects(options.setIgnoreBreakStatements())
		);
	}

	initialiseChildren() {
		if (this.init) this.init.initialise(this.scope);
		if (this.test) this.test.initialise(this.scope);
		if (this.update) this.update.initialise(this.scope);
		this.body.initialise(this.scope);
	}

	initialiseScope(parentScope: Scope) {
		this.scope = new BlockScope({ parent: parentScope });
	}

	render(code: MagicString, options: RenderOptions) {
		if (this.init) this.init.render(code, options, NO_SEMICOLON);
		if (this.test) this.test.render(code, options, NO_SEMICOLON);
		if (this.update) this.update.render(code, options, NO_SEMICOLON);
		this.body.render(code, options);
	}
}
