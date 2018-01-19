import MagicString from 'magic-string';
import { StatementBase } from './shared/Statement';
import { NodeType } from './index';
export default class EmptyStatement extends StatementBase {
    type: NodeType.EmptyStatement;
    render(code: MagicString): void;
}
