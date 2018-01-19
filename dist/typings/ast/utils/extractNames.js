"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractNames(param) {
    var names = [];
    extractors[param.type](names, param);
    return names;
}
exports.default = extractNames;
var extractors = {
    Identifier: function (names, param) {
        names.push(param.name);
    },
    ObjectPattern: function (names, param) {
        param.properties.forEach(function (prop) {
            extractors[prop.value.type](names, prop.value);
        });
    },
    ArrayPattern: function (names, param) {
        param.elements.forEach(function (element) {
            if (element)
                extractors[element.type](names, element);
        });
    },
    RestElement: function (names, param) {
        extractors[param.argument.type](names, param.argument);
    },
    AssignmentPattern: function (names, param) {
        extractors[param.left.type](names, param.left);
    }
};
