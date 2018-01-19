"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function error(props) {
    // use the same constructor as props (if it's an error object)
    // so that err.name is preserved etc
    // (Object.keys below does not update these values because they
    // are properties on the prototype chain)
    // basically if props is a SyntaxError it will not be overriden as a generic Error
    var constructor = props instanceof Error ? props.constructor : Error;
    var err = new constructor(props.message);
    Object.keys(props).forEach(function (key) {
        err[key] = props[key];
    });
    throw err;
}
exports.default = error;
