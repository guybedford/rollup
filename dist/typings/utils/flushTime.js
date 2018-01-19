"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEBUG = false;
var map = new Map();
var timeStartHelper;
var timeEndHelper;
if (typeof process === 'undefined' || typeof process.hrtime === 'undefined') {
    timeStartHelper = function timeStartHelper() {
        return window.performance.now();
    };
    timeEndHelper = function timeEndHelper(previous) {
        return window.performance.now() - previous;
    };
}
else {
    timeStartHelper = function timeStartHelper() {
        return process.hrtime();
    };
    timeEndHelper = function timeEndHelper(previous) {
        var hrtime = process.hrtime(previous);
        return hrtime[0] * 1e3 + Math.floor(hrtime[1] / 1e6);
    };
}
function timeStart(label) {
    if (!map.has(label)) {
        map.set(label, {
            start: undefined,
            time: 0
        });
    }
    map.get(label).start = timeStartHelper();
}
exports.timeStart = timeStart;
function timeEnd(label) {
    if (map.has(label)) {
        var item = map.get(label);
        item.time += timeEndHelper(item.start);
    }
}
exports.timeEnd = timeEnd;
function flushTime(log) {
    if (log === void 0) { log = defaultLog; }
    for (var _i = 0, _a = map.entries(); _i < _a.length; _i++) {
        var item = _a[_i];
        log(item[0], item[1].time);
    }
    map.clear();
}
exports.flushTime = flushTime;
/** @interal */
function defaultLog(label, time) {
    if (DEBUG) {
        /* eslint-disable no-console */
        console.info('%dms: %s', time, label);
        /* eslint-enable no-console */
    }
}
exports.defaultLog = defaultLog;
