import { NodeBase } from './shared/Node';
import Scope from '../scopes/Scope';
import ExecutionPathOptions from '../ExecutionPathOptions';
import { ObjectPath } from '../variables/VariableReassignmentTracker';
import { PatternNode } from './shared/Pattern';
import { ExpressionNode } from './shared/Expression';

export default class VariableDeclarator extends NodeBase {
	type: 'VariableDeclarator';
	id: PatternNode;
	init: ExpressionNode | null;

	reassignPath (path: ObjectPath, options: ExecutionPathOptions) {
		this.id.reassignPath(path, options);
	}

	initialiseDeclarator (parentScope: Scope, kind: string) {
		this.initialiseScope(parentScope);
		this.init && this.init.initialise(this.scope);
		this.id.initialiseAndDeclare(this.scope, kind, this.init);
	}
}
