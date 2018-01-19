"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generate strings which dereference dotted properties, but use array notation `['prop-deref']`
// if the property name isn't trivial
var shouldUseDot = /^[a-zA-Z$_][a-zA-Z0-9$_]*$/;
function property(prop) {
    return shouldUseDot.test(prop) ? "." + prop : "['" + prop + "']";
}
exports.property = property;
function keypath(keypath) {
    return keypath
        .split('.')
        .map(property)
        .join('');
}
exports.keypath = keypath;
