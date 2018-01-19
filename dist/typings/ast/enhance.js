"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./nodes/index");
var UnknownNode_1 = require("./nodes/UnknownNode");
var keys_1 = require("./keys");
var Import_1 = require("./nodes/Import");
var newline = /\n/;
function enhance(ast, module, comments, dynamicImportReturnList) {
    enhanceNode(ast, {}, module, module.magicString, dynamicImportReturnList);
    var comment = comments.shift();
    for (var _i = 0, _a = ast.body; _i < _a.length; _i++) {
        var node = _a[_i];
        if (comment && comment.start < node.start) {
            node.leadingCommentStart = comment.start;
        }
        while (comment && comment.end < node.end)
            comment = comments.shift();
        // if the next comment is on the same line as the end of the node,
        // treat is as a trailing comment
        if (comment && !newline.test(module.code.slice(node.end, comment.start))) {
            node.trailingCommentEnd = comment.end; // TODO is node.trailingCommentEnd used anywhere?
            comment = comments.shift();
        }
        node.initialise(module.scope);
    }
}
exports.default = enhance;
function isArrayOfNodes(raw) {
    return 'length' in raw;
}
function enhanceNode(raw, parent, module, code, dynamicImportReturnList) {
    if (!raw)
        return;
    if (isArrayOfNodes(raw)) {
        for (var i = 0; i < raw.length; i += 1) {
            enhanceNode(raw[i], parent, module, code, dynamicImportReturnList);
        }
        return;
    }
    var rawNode = raw;
    // with e.g. shorthand properties, key and value are
    // the same node. We don't want to enhance an object twice
    if (rawNode.__enhanced)
        return;
    rawNode.__enhanced = true;
    if (!keys_1.default[rawNode.type]) {
        keys_1.default[rawNode.type] = Object.keys(rawNode).filter(function (key) { return typeof rawNode[key] === 'object'; });
    }
    rawNode.parent = parent;
    rawNode.module = module;
    rawNode.keys = keys_1.default[rawNode.type];
    code.addSourcemapLocation(rawNode.start);
    code.addSourcemapLocation(rawNode.end);
    for (var _i = 0, _a = keys_1.default[rawNode.type]; _i < _a.length; _i++) {
        var key = _a[_i];
        enhanceNode(rawNode[key], rawNode, module, code, dynamicImportReturnList);
    }
    var type = index_1.default[rawNode.type] || UnknownNode_1.default;
    rawNode.__proto__ = type.prototype;
    if (type === Import_1.default) {
        dynamicImportReturnList.push(rawNode);
    }
}
