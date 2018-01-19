"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNKNOWN_VALUE = { toString: function () { return '[[UNKNOWN]]'; } };
exports.UNKNOWN_EXPRESSION = {
    reassignPath: function () { },
    forEachReturnExpressionWhenCalledAtPath: function () { },
    getValue: function () { return exports.UNKNOWN_VALUE; },
    hasEffectsWhenAccessedAtPath: function (path) { return path.length > 0; },
    hasEffectsWhenAssignedAtPath: function (path) { return path.length > 0; },
    hasEffectsWhenCalledAtPath: function () { return true; },
    someReturnExpressionWhenCalledAtPath: function () { return true; },
    toString: function () { return '[[UNKNOWN]]'; }
};
