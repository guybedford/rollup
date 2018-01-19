"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var values_1 = require("../values");
function isUnknownKey(key) {
    return key === exports.UNKNOWN_KEY;
}
exports.isUnknownKey = isUnknownKey;
exports.UNKNOWN_KEY = { type: 'UNKNOWN_KEY' };
var ReassignedPathTracker = /** @class */ (function () {
    function ReassignedPathTracker() {
        this._reassigned = false;
        this._unknownReassignedSubPath = false;
        this._subPaths = new Map();
    }
    ReassignedPathTracker.prototype.isReassigned = function (path) {
        if (path.length === 0) {
            return this._reassigned;
        }
        var subPath = path[0], remainingPath = path.slice(1);
        return (this._unknownReassignedSubPath ||
            (this._subPaths.has(subPath) &&
                this._subPaths.get(subPath).isReassigned(remainingPath)));
    };
    ReassignedPathTracker.prototype.reassignPath = function (path) {
        if (this._reassigned)
            return;
        if (path.length === 0) {
            this._reassigned = true;
        }
        else {
            this._reassignSubPath(path);
        }
    };
    ReassignedPathTracker.prototype._reassignSubPath = function (path) {
        if (this._unknownReassignedSubPath)
            return;
        var subPath = path[0], remainingPath = path.slice(1);
        if (subPath === exports.UNKNOWN_KEY) {
            this._unknownReassignedSubPath = true;
        }
        else {
            if (!this._subPaths.has(subPath)) {
                this._subPaths.set(subPath, new ReassignedPathTracker());
            }
            this._subPaths.get(subPath).reassignPath(remainingPath);
        }
    };
    ReassignedPathTracker.prototype.someReassignedPath = function (path, callback) {
        return this._reassigned
            ? callback(path, values_1.UNKNOWN_EXPRESSION)
            : path.length >= 1 && this._onSubPathIfReassigned(path, callback);
    };
    ReassignedPathTracker.prototype._onSubPathIfReassigned = function (path, callback) {
        var subPath = path[0], remainingPath = path.slice(1);
        return this._unknownReassignedSubPath || subPath === exports.UNKNOWN_KEY
            ? callback(remainingPath, values_1.UNKNOWN_EXPRESSION)
            : this._subPaths.has(subPath) &&
                this._subPaths
                    .get(subPath)
                    .someReassignedPath(remainingPath, callback);
    };
    return ReassignedPathTracker;
}());
var VariableReassignmentTracker = /** @class */ (function () {
    function VariableReassignmentTracker(initialExpression) {
        this._initialExpression = initialExpression;
        this._reassignedPathTracker = new ReassignedPathTracker();
    }
    VariableReassignmentTracker.prototype.reassignPath = function (path, options) {
        if (path.length > 0) {
            this._initialExpression &&
                this._initialExpression.reassignPath(path, options);
        }
        this._reassignedPathTracker.reassignPath(path);
    };
    VariableReassignmentTracker.prototype.forEachAtPath = function (path, callback) {
        this._initialExpression && callback(path, this._initialExpression);
    };
    VariableReassignmentTracker.prototype.someAtPath = function (path, predicateFunction) {
        return (this._reassignedPathTracker.someReassignedPath(path, predicateFunction) ||
            (this._initialExpression &&
                predicateFunction(path, this._initialExpression)));
    };
    return VariableReassignmentTracker;
}());
exports.default = VariableReassignmentTracker;
