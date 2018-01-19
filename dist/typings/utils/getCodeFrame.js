"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function spaces(i) {
    var result = '';
    while (i--)
        result += ' ';
    return result;
}
function tabsToSpaces(str) {
    return str.replace(/^\t+/, function (match) { return match.split('\t').join('  '); });
}
function getCodeFrame(source, line, column) {
    var lines = source.split('\n');
    var frameStart = Math.max(0, line - 3);
    var frameEnd = Math.min(line + 2, lines.length);
    lines = lines.slice(frameStart, frameEnd);
    while (!/\S/.test(lines[lines.length - 1])) {
        lines.pop();
        frameEnd -= 1;
    }
    var digits = String(frameEnd).length;
    return lines
        .map(function (str, i) {
        var isErrorLine = frameStart + i + 1 === line;
        var lineNum = String(i + frameStart + 1);
        while (lineNum.length < digits)
            lineNum = " " + lineNum;
        if (isErrorLine) {
            var indicator = spaces(digits + 2 + tabsToSpaces(str.slice(0, column)).length) + '^';
            return lineNum + ": " + tabsToSpaces(str) + "\n" + indicator;
        }
        return lineNum + ": " + tabsToSpaces(str);
    })
        .join('\n');
}
exports.default = getCodeFrame;
