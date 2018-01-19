"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var OptionTypes;
(function (OptionTypes) {
    OptionTypes[OptionTypes["IGNORED_LABELS"] = 0] = "IGNORED_LABELS";
    OptionTypes[OptionTypes["ACCESSED_NODES"] = 1] = "ACCESSED_NODES";
    OptionTypes[OptionTypes["ARGUMENTS_VARIABLES"] = 2] = "ARGUMENTS_VARIABLES";
    OptionTypes[OptionTypes["ASSIGNED_NODES"] = 3] = "ASSIGNED_NODES";
    OptionTypes[OptionTypes["IGNORE_BREAK_STATEMENTS"] = 4] = "IGNORE_BREAK_STATEMENTS";
    OptionTypes[OptionTypes["IGNORE_RETURN_AWAIT_YIELD"] = 5] = "IGNORE_RETURN_AWAIT_YIELD";
    OptionTypes[OptionTypes["NODES_CALLED_AT_PATH_WITH_OPTIONS"] = 6] = "NODES_CALLED_AT_PATH_WITH_OPTIONS";
    OptionTypes[OptionTypes["REPLACED_VARIABLE_INITS"] = 7] = "REPLACED_VARIABLE_INITS";
    OptionTypes[OptionTypes["RETURN_EXPRESSIONS_ACCESSED_AT_PATH"] = 8] = "RETURN_EXPRESSIONS_ACCESSED_AT_PATH";
    OptionTypes[OptionTypes["RETURN_EXPRESSIONS_ASSIGNED_AT_PATH"] = 9] = "RETURN_EXPRESSIONS_ASSIGNED_AT_PATH";
    OptionTypes[OptionTypes["RETURN_EXPRESSIONS_CALLED_AT_PATH"] = 10] = "RETURN_EXPRESSIONS_CALLED_AT_PATH";
})(OptionTypes = exports.OptionTypes || (exports.OptionTypes = {}));
exports.RESULT_KEY = {};
var ExecutionPathOptions = /** @class */ (function () {
    function ExecutionPathOptions(optionValues) {
        this.optionValues = optionValues;
    }
    ExecutionPathOptions.create = function () {
        return new this(immutable_1.default.Map());
    };
    ExecutionPathOptions.prototype.get = function (option) {
        return this.optionValues.get(option);
    };
    ExecutionPathOptions.prototype.remove = function (option) {
        return new ExecutionPathOptions(this.optionValues.remove(option));
    };
    ExecutionPathOptions.prototype.set = function (option, value) {
        return new ExecutionPathOptions(this.optionValues.set(option, value));
    };
    ExecutionPathOptions.prototype.setIn = function (optionPath, value) {
        return new ExecutionPathOptions(this.optionValues.setIn(optionPath, value));
    };
    ExecutionPathOptions.prototype.addAccessedNodeAtPath = function (path, node) {
        return this.setIn([OptionTypes.ACCESSED_NODES, node].concat(path, [exports.RESULT_KEY]), true);
    };
    ExecutionPathOptions.prototype.addAccessedReturnExpressionAtPath = function (path, callExpression) {
        return this.setIn([
            OptionTypes.RETURN_EXPRESSIONS_ACCESSED_AT_PATH,
            callExpression
        ].concat(path, [
            exports.RESULT_KEY
        ]), true);
    };
    ExecutionPathOptions.prototype.addAssignedNodeAtPath = function (path, node) {
        return this.setIn([OptionTypes.ASSIGNED_NODES, node].concat(path, [exports.RESULT_KEY]), true);
    };
    ExecutionPathOptions.prototype.addAssignedReturnExpressionAtPath = function (path, callExpression) {
        return this.setIn([
            OptionTypes.RETURN_EXPRESSIONS_ASSIGNED_AT_PATH,
            callExpression
        ].concat(path, [
            exports.RESULT_KEY
        ]), true);
    };
    ExecutionPathOptions.prototype.addCalledNodeAtPathWithOptions = function (path, node, callOptions) {
        return this.setIn([
            OptionTypes.NODES_CALLED_AT_PATH_WITH_OPTIONS,
            node
        ].concat(path, [
            exports.RESULT_KEY,
            callOptions
        ]), true);
    };
    ExecutionPathOptions.prototype.addCalledReturnExpressionAtPath = function (path, callExpression) {
        return this.setIn([
            OptionTypes.RETURN_EXPRESSIONS_CALLED_AT_PATH,
            callExpression
        ].concat(path, [
            exports.RESULT_KEY
        ]), true);
    };
    ExecutionPathOptions.prototype.getArgumentsVariables = function () {
        return (this.get(OptionTypes.ARGUMENTS_VARIABLES) || []);
    };
    ExecutionPathOptions.prototype.getHasEffectsWhenCalledOptions = function () {
        return this.setIgnoreReturnAwaitYield()
            .setIgnoreBreakStatements(false)
            .setIgnoreNoLabels();
    };
    ExecutionPathOptions.prototype.getReplacedVariableInit = function (variable) {
        return this.optionValues.getIn([OptionTypes.REPLACED_VARIABLE_INITS, variable]);
    };
    ExecutionPathOptions.prototype.hasNodeBeenAccessedAtPath = function (path, node) {
        return this.optionValues.getIn([
            OptionTypes.ACCESSED_NODES,
            node
        ].concat(path, [
            exports.RESULT_KEY
        ]));
    };
    ExecutionPathOptions.prototype.hasNodeBeenAssignedAtPath = function (path, node) {
        return this.optionValues.getIn([
            OptionTypes.ASSIGNED_NODES,
            node
        ].concat(path, [
            exports.RESULT_KEY
        ]));
    };
    ExecutionPathOptions.prototype.hasNodeBeenCalledAtPathWithOptions = function (path, node, callOptions) {
        var previousCallOptions = this.optionValues.getIn([
            OptionTypes.NODES_CALLED_AT_PATH_WITH_OPTIONS,
            node
        ].concat(path, [
            exports.RESULT_KEY
        ]));
        return (previousCallOptions &&
            previousCallOptions.find(function (_, otherCallOptions) {
                return otherCallOptions.equals(callOptions);
            }));
    };
    ExecutionPathOptions.prototype.hasReturnExpressionBeenAccessedAtPath = function (path, callExpression) {
        return this.optionValues.getIn([
            OptionTypes.RETURN_EXPRESSIONS_ACCESSED_AT_PATH,
            callExpression
        ].concat(path, [
            exports.RESULT_KEY
        ]));
    };
    ExecutionPathOptions.prototype.hasReturnExpressionBeenAssignedAtPath = function (path, callExpression) {
        return this.optionValues.getIn([
            OptionTypes.RETURN_EXPRESSIONS_ASSIGNED_AT_PATH,
            callExpression
        ].concat(path, [
            exports.RESULT_KEY
        ]));
    };
    ExecutionPathOptions.prototype.hasReturnExpressionBeenCalledAtPath = function (path, callExpression) {
        return this.optionValues.getIn([
            OptionTypes.RETURN_EXPRESSIONS_CALLED_AT_PATH,
            callExpression
        ].concat(path, [
            exports.RESULT_KEY
        ]));
    };
    ExecutionPathOptions.prototype.ignoreBreakStatements = function () {
        return this.get(OptionTypes.IGNORE_BREAK_STATEMENTS);
    };
    ExecutionPathOptions.prototype.ignoreLabel = function (labelName) {
        return this.optionValues.getIn([OptionTypes.IGNORED_LABELS, labelName]);
    };
    ExecutionPathOptions.prototype.ignoreReturnAwaitYield = function () {
        return this.get(OptionTypes.IGNORE_RETURN_AWAIT_YIELD);
    };
    ExecutionPathOptions.prototype.replaceVariableInit = function (variable, init) {
        return this.setIn([OptionTypes.REPLACED_VARIABLE_INITS, variable], init);
    };
    ExecutionPathOptions.prototype.setArgumentsVariables = function (variables) {
        return this.set(OptionTypes.ARGUMENTS_VARIABLES, variables);
    };
    ExecutionPathOptions.prototype.setIgnoreBreakStatements = function (value) {
        if (value === void 0) { value = true; }
        return this.set(OptionTypes.IGNORE_BREAK_STATEMENTS, value);
    };
    ExecutionPathOptions.prototype.setIgnoreLabel = function (labelName) {
        return this.setIn([OptionTypes.IGNORED_LABELS, labelName], true);
    };
    ExecutionPathOptions.prototype.setIgnoreNoLabels = function () {
        return this.remove(OptionTypes.IGNORED_LABELS);
    };
    ExecutionPathOptions.prototype.setIgnoreReturnAwaitYield = function (value) {
        if (value === void 0) { value = true; }
        return this.set(OptionTypes.IGNORE_RETURN_AWAIT_YIELD, value);
    };
    return ExecutionPathOptions;
}());
exports.default = ExecutionPathOptions;
