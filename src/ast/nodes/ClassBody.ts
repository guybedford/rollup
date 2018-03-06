import { NodeBase } from './shared/Node';
import ExecutionPathOptions from '../ExecutionPathOptions';
import CallOptions from '../CallOptions';
import MethodDefinition from './MethodDefinition';
import { NodeType } from './NodeType';
import { ObjectPath } from '../values';

export default class ClassBody extends NodeBase {
	type: NodeType.ClassBody;
	body: MethodDefinition[];
	classConstructor: MethodDefinition | null;

	eachChild(callback: (node: MethodDefinition) => void): void {
		for (let i = 0; i < this.body.length; i++) callback(this.body[i]);
	}

	hasEffectsWhenCalledAtPath(
		path: ObjectPath,
		callOptions: CallOptions,
		options: ExecutionPathOptions
	) {
		if (path.length > 0) {
			return true;
		}
		return (
			this.classConstructor &&
			this.classConstructor.hasEffectsWhenCalledAtPath([], callOptions, options)
		);
	}

	initialiseNode() {
		this.classConstructor = this.body.find(method => method.kind === 'constructor');
	}
}
