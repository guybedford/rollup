import Scope from '../../scopes/Scope';
import CallOptions from '../../CallOptions';
import ExecutionPathOptions from '../../ExecutionPathOptions';
import Identifier from '../Identifier';
import ClassBody from '../ClassBody';
import { ExpressionNode, NodeBase } from './Node';
import { ObjectPath } from '../../values';

export default class ClassNode extends NodeBase {
	body: ClassBody;
	superClass: ExpressionNode | null;
	id: Identifier | null;

	eachChild(callback: (node: Identifier | ExpressionNode | ClassBody) => void): void {
		if (this.id) callback(this.id);
		if (this.superClass) callback(this.superClass);
		callback(this.body);
	}

	hasEffectsWhenAccessedAtPath(path: ObjectPath, _options: ExecutionPathOptions) {
		return path.length > 1;
	}

	hasEffectsWhenAssignedAtPath(path: ObjectPath, _options: ExecutionPathOptions) {
		return path.length > 1;
	}

	hasEffectsWhenCalledAtPath(
		path: ObjectPath,
		callOptions: CallOptions,
		options: ExecutionPathOptions
	) {
		return (
			this.body.hasEffectsWhenCalledAtPath(path, callOptions, options) ||
			(this.superClass && this.superClass.hasEffectsWhenCalledAtPath(path, callOptions, options))
		);
	}

	initialiseChildren(_parentScope: Scope) {
		if (this.superClass) {
			this.superClass.initialise(this.scope);
		}
		this.body.initialise(this.scope);
	}

	initialiseScope(parentScope: Scope) {
		this.scope = new Scope({ parent: parentScope });
	}
}
