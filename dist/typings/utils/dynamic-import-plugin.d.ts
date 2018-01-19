/// <reference types="acorn" />
import { PluginsObject, TokenType } from 'acorn';
export default function wrapDynamicImportPlugin(acorn: {
    tokTypes: {
        [type: string]: TokenType;
    };
    plugins: PluginsObject;
}): void;
