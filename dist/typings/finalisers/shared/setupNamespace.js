"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sanitize_1 = require("./sanitize");
function setupNamespace(name, root, forAssignment, globals) {
    var parts = name.split('.');
    if (globals) {
        parts[0] =
            (typeof globals === 'function' ? globals(parts[0]) : globals[parts[0]]) ||
                parts[0];
    }
    var last = parts.pop();
    var acc = root;
    if (forAssignment) {
        return parts
            .map(function (part) { return ((acc += sanitize_1.property(part)), acc + " = " + acc + " || {}"); })
            .concat("" + acc + sanitize_1.property(last))
            .join(', ');
    }
    else {
        return (parts
            .map(function (part) { return ((acc += sanitize_1.property(part)), acc + " = " + acc + " || {};"); })
            .join('\n') + '\n');
    }
}
exports.default = setupNamespace;
