import { ObjectPath, UNKNOWN_EXPRESSION } from '../values';
import Scope from '../scopes/Scope';
import ExecutionPathOptions from '../ExecutionPathOptions';
import { PatternNode } from './shared/Pattern';
import { ExpressionEntity } from './shared/Expression';
import { NodeBase } from './shared/Node';
import { NodeType } from './NodeType';

export default class ArrayPattern extends NodeBase implements PatternNode {
	type: NodeType.ArrayPattern;
	elements: (PatternNode | null)[];

	eachChild(callback: (node: PatternNode) => void): void {
		for (let i = 0; i < this.elements.length; i++) {
			const el = this.elements[i];
			if (el) callback(el);
		}
	}

	reassignPath(path: ObjectPath, options: ExecutionPathOptions) {
		path.length === 0 && this.elements.forEach(child => child && child.reassignPath([], options));
	}

	hasEffectsWhenAssignedAtPath(path: ObjectPath, options: ExecutionPathOptions) {
		return (
			path.length > 0 ||
			this.elements.some(child => child && child.hasEffectsWhenAssignedAtPath([], options))
		);
	}

	initialiseAndDeclare(parentScope: Scope, kind: string, _init: ExpressionEntity | null) {
		this.initialiseScope(parentScope);
		this.elements.forEach(
			child => child && child.initialiseAndDeclare(parentScope, kind, UNKNOWN_EXPRESSION)
		);
	}
}
