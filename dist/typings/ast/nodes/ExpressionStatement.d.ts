import MagicString from 'magic-string';
import { StatementBase } from './shared/Statement';
import Scope from '../scopes/Scope';
export default class ExpressionStatement extends StatementBase {
    directive?: string;
    initialiseNode(_parentScope: Scope): void;
    shouldBeIncluded(): boolean;
    render(code: MagicString): void;
}
