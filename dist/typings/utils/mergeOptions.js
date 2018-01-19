"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ensureArray_js_1 = require("./ensureArray.js");
var deprecateOptions_1 = require("./deprecateOptions");
function normalizeObjectOptionValue(optionValue) {
    if (!optionValue) {
        return optionValue;
    }
    if (typeof optionValue !== 'object') {
        return {};
    }
    return optionValue;
}
var defaultOnWarn = function (warning) { return console.warn(warning.message); }; // eslint-disable-line no-console
function mergeOptions(_a) {
    var config = _a.config, _b = _a.command, command = _b === void 0 ? {} : _b, deprecateConfig = _a.deprecateConfig, _c = _a.defaultOnWarnHandler, defaultOnWarnHandler = _c === void 0 ? defaultOnWarn : _c;
    var deprecations = deprecate(config, command, deprecateConfig);
    var getOption = function (config) { return function (name) {
        return command[name] !== undefined ? command[name] : config[name];
    }; };
    var getInputOption = getOption(config);
    var getOutputOption = getOption(config.output || {});
    function getObjectOption(name) {
        var commandOption = normalizeObjectOptionValue(command[name]);
        var configOption = normalizeObjectOptionValue(config[name]);
        if (commandOption !== undefined) {
            return commandOption && configOption
                ? Object.assign({}, configOption, commandOption)
                : commandOption;
        }
        return configOption;
    }
    var onwarn = config.onwarn;
    var warn;
    if (onwarn) {
        warn = function (warning) { return onwarn(warning, defaultOnWarnHandler); };
    }
    else {
        warn = defaultOnWarnHandler;
    }
    var inputOptions = {
        input: getInputOption('input'),
        legacy: getInputOption('legacy'),
        treeshake: getObjectOption('treeshake'),
        acorn: config.acorn,
        context: config.context,
        moduleContext: config.moduleContext,
        plugins: config.plugins,
        onwarn: warn,
        watch: config.watch,
        cache: getInputOption('cache'),
        preferConst: getInputOption('preferConst'),
        experimentalDynamicImport: getInputOption('experimentalDynamicImport'),
        experimentalCodeSplitting: getInputOption('experimentalCodeSplitting')
    };
    // legacy, to ensure e.g. commonjs plugin still works
    inputOptions.entry = inputOptions.input;
    var commandExternal = (command.external || '').split(',');
    var configExternal = config.external;
    if (command.globals) {
        var globals_1 = Object.create(null);
        command.globals.split(',').forEach(function (str) {
            var names = str.split(':');
            globals_1[names[0]] = names[1];
            // Add missing Module IDs to external.
            if (commandExternal.indexOf(names[0]) === -1) {
                commandExternal.push(names[0]);
            }
        });
        command.globals = globals_1;
    }
    if (typeof configExternal === 'function') {
        inputOptions.external = function (id) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            return configExternal.apply(void 0, [id].concat(rest)) || ~commandExternal.indexOf(id);
        };
    }
    else {
        inputOptions.external = (configExternal || []).concat(commandExternal);
    }
    if (command.silent) {
        inputOptions.onwarn = function () { };
    }
    var baseOutputOptions = {
        extend: getOutputOption('extend'),
        amd: Object.assign({}, config.amd, command.amd),
        banner: getOutputOption('banner'),
        footer: getOutputOption('footer'),
        intro: getOutputOption('intro'),
        format: getOutputOption('format'),
        outro: getOutputOption('outro'),
        sourcemap: getOutputOption('sourcemap'),
        sourcemapFile: getOutputOption('sourcemapFile'),
        name: getOutputOption('name'),
        globals: getOutputOption('globals'),
        interop: getOutputOption('interop'),
        legacy: getOutputOption('legacy'),
        freeze: getOutputOption('freeze'),
        indent: getOutputOption('indent'),
        strict: getOutputOption('strict'),
        noConflict: getOutputOption('noConflict'),
        paths: getOutputOption('paths'),
        exports: getOutputOption('exports'),
        file: getOutputOption('file'),
        dir: getOutputOption('dir')
    };
    var mergedOutputOptions;
    if (Array.isArray(config.output)) {
        mergedOutputOptions = config.output.map(function (output) {
            return Object.assign({}, output, command.output);
        });
    }
    else if (config.output && command.output) {
        mergedOutputOptions = [Object.assign({}, config.output, command.output)];
    }
    else {
        mergedOutputOptions =
            command.output || config.output
                ? ensureArray_js_1.default(command.output || config.output)
                : [
                    {
                        file: command.output ? command.output.file : null,
                        format: command.output ? command.output.format : null
                    }
                ];
    }
    var outputOptions = mergedOutputOptions.map(function (output) {
        return Object.assign({}, baseOutputOptions, output);
    });
    // check for errors
    var validKeys = Object.keys(inputOptions).concat(Object.keys(baseOutputOptions), [
        'pureExternalModules' // (backward compatibility) till everyone moves to treeshake.pureExternalModules
    ]);
    var outputOptionKeys = Array.isArray(config.output)
        ? config.output.reduce(function (keys, o) { return keys.concat(Object.keys(o)); }, [])
        : Object.keys(config.output || {});
    var errors = Object.keys(config || {}).concat(outputOptionKeys).filter(function (k) { return k !== 'output' && validKeys.indexOf(k) === -1; });
    return {
        inputOptions: inputOptions,
        outputOptions: outputOptions,
        deprecations: deprecations,
        optionError: errors.length
            ? "Unknown option found: " + errors.join(', ') + ". Allowed keys: " + validKeys.join(', ')
            : null
    };
}
exports.default = mergeOptions;
function deprecate(config, command, deprecateConfig) {
    if (command === void 0) { command = {}; }
    if (deprecateConfig === void 0) { deprecateConfig = { input: true, output: true }; }
    var deprecations = [];
    // CLI
    if (command.id) {
        deprecations.push({
            old: '-u/--id',
            new: '--amd.id'
        });
        (command.amd || (command.amd = {})).id = command.id;
    }
    if (typeof command.output === 'string') {
        deprecations.push({
            old: '--output',
            new: '--output.file'
        });
        command.output = { file: command.output };
    }
    if (command.format) {
        deprecations.push({
            old: '--format',
            new: '--output.format'
        });
        (command.output || (command.output = {})).format = command.format;
    }
    // config file
    deprecations.push.apply(deprecations, deprecateOptions_1.default(config, deprecateConfig));
    return deprecations;
}
