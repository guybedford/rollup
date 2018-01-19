"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var events_1 = require("events");
var createFilter_js_1 = require("rollup-pluginutils/src/createFilter.js");
var index_1 = require("../rollup/index");
var ensureArray_1 = require("../utils/ensureArray");
var promise_1 = require("../utils/promise");
var fileWatchers_1 = require("./fileWatchers");
var chokidar_1 = require("./chokidar");
var mergeOptions_js_1 = require("../utils/mergeOptions.js");
var DELAY = 100;
var Watcher = /** @class */ (function (_super) {
    __extends(Watcher, _super);
    function Watcher(configs) {
        var _this = _super.call(this) || this;
        _this.dirty = true;
        _this.running = false;
        _this.tasks = ensureArray_1.default(configs).map(function (config) { return new Task(_this, config); });
        _this.succeeded = false;
        process.nextTick(function () {
            _this._run();
        });
        return _this;
    }
    Watcher.prototype.close = function () {
        this.tasks.forEach(function (task) {
            task.close();
        });
        this.removeAllListeners();
    };
    Watcher.prototype._makeDirty = function () {
        var _this = this;
        if (this.dirty)
            return;
        this.dirty = true;
        if (!this.running) {
            setTimeout(function () {
                _this._run();
            }, DELAY);
        }
    };
    Watcher.prototype._run = function () {
        var _this = this;
        this.running = true;
        this.dirty = false;
        this.emit('event', {
            code: 'START'
        });
        promise_1.mapSequence(this.tasks, function (task) { return task.run(); })
            .then(function () {
            _this.succeeded = true;
            _this.emit('event', {
                code: 'END'
            });
        })
            .catch(function (error) {
            _this.emit('event', {
                code: _this.succeeded ? 'ERROR' : 'FATAL',
                error: error
            });
        })
            .then(function () {
            _this.running = false;
            if (_this.dirty) {
                _this._run();
            }
        });
    };
    return Watcher;
}(events_1.default));
exports.Watcher = Watcher;
var Task = /** @class */ (function () {
    function Task(watcher, config) {
        this.cache = null;
        this.watcher = watcher;
        this.dirty = true;
        this.closed = false;
        this.watched = new Set();
        var _a = mergeOptions_js_1.default({ config: config }), inputOptions = _a.inputOptions, outputOptions = _a.outputOptions, deprecations = _a.deprecations;
        this.inputOptions = inputOptions;
        this.outputs = outputOptions;
        this.outputFiles = this.outputs.map(function (output) {
            if (!output.file) {
                throw new Error("watch is currently only supported for a single output.file");
            }
            return path_1.default.resolve(output.file);
        });
        var watchOptions = inputOptions.watch || {};
        if ('useChokidar' in watchOptions)
            watchOptions.chokidar = watchOptions.useChokidar;
        var chokidarOptions = 'chokidar' in watchOptions ? watchOptions.chokidar : !!chokidar_1.default;
        if (chokidarOptions) {
            chokidarOptions = Object.assign(chokidarOptions === true ? {} : chokidarOptions, {
                ignoreInitial: true
            });
        }
        if (chokidarOptions && !chokidar_1.default) {
            throw new Error("options.watch.chokidar was provided, but chokidar could not be found. Have you installed it?");
        }
        this.chokidarOptions = chokidarOptions;
        this.chokidarOptionsHash = JSON.stringify(chokidarOptions);
        this.filter = createFilter_js_1.default(watchOptions.include, watchOptions.exclude);
        this.deprecations = deprecations.concat((watchOptions._deprecations || []));
    }
    Task.prototype.close = function () {
        var _this = this;
        this.closed = true;
        this.watched.forEach(function (id) {
            fileWatchers_1.deleteTask(id, _this, _this.chokidarOptionsHash);
        });
    };
    Task.prototype.makeDirty = function () {
        if (!this.dirty) {
            this.dirty = true;
            this.watcher._makeDirty();
        }
    };
    Task.prototype.run = function () {
        var _this = this;
        if (!this.dirty)
            return;
        this.dirty = false;
        var options = Object.assign(this.inputOptions, {
            cache: this.cache
        });
        var start = Date.now();
        this.watcher.emit('event', {
            code: 'BUNDLE_START',
            input: this.inputOptions.input,
            output: this.outputFiles
        });
        if (this.deprecations.length) {
            this.inputOptions.onwarn({
                code: 'DEPRECATED_OPTIONS',
                deprecations: this.deprecations,
                message: "The following options have been renamed \u2014 please update your config: " + this.deprecations.map(function (option) { return option.old + " -> " + option.new; }).join(', '),
            });
        }
        return index_1.default(options)
            .then(function (chunk) {
            if (_this.closed)
                return;
            _this.cache = chunk;
            var watched = new Set();
            chunk.modules.forEach(function (module) {
                watched.add(module.id);
                _this.watchFile(module.id);
            });
            _this.watched.forEach(function (id) {
                if (!watched.has(id))
                    fileWatchers_1.deleteTask(id, _this, _this.chokidarOptionsHash);
            });
            _this.watched = watched;
            return Promise.all(_this.outputs.map(function (output) { return chunk.write(output); }));
        })
            .then(function () {
            _this.watcher.emit('event', {
                code: 'BUNDLE_END',
                input: _this.inputOptions.input,
                output: _this.outputFiles,
                duration: Date.now() - start
            });
        })
            .catch(function (error) {
            if (_this.closed)
                return;
            if (_this.cache) {
                _this.cache.modules.forEach(function (module) {
                    // this is necessary to ensure that any 'renamed' files
                    // continue to be watched following an error
                    _this.watchFile(module.id);
                });
            }
            throw error;
        });
    };
    Task.prototype.watchFile = function (id) {
        if (!this.filter(id))
            return;
        if (this.outputFiles.some(function (file) { return file === id; })) {
            throw new Error('Cannot import the generated bundle');
        }
        // this is necessary to ensure that any 'renamed' files
        // continue to be watched following an error
        fileWatchers_1.addTask(id, this, this.chokidarOptions, this.chokidarOptionsHash);
    };
    return Task;
}());
exports.Task = Task;
function watch(configs) {
    return new Watcher(configs);
}
exports.default = watch;
