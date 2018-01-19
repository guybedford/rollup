import CallExpression from './CallExpression';
import { NodeType } from './index';
import { NodeBase } from './shared/Node';
import MagicString from 'magic-string';
import NamespaceVariable from '../variables/NamespaceVariable';
export interface DynamicImportMechanism {
    left: string;
    right: string;
}
export default class Import extends NodeBase {
    type: NodeType.Import;
    parent: CallExpression;
    private resolution;
    private mechanism;
    setResolution(resolution: NamespaceVariable | string | void, mechanism?: DynamicImportMechanism | void): void;
    render(code: MagicString): void;
}
