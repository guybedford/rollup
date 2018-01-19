"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var chokidar_1 = require("./chokidar");
var opts = { encoding: 'utf-8', persistent: true };
var watchers = new Map();
function addTask(id, task, chokidarOptions, chokidarOptionsHash) {
    if (!watchers.has(chokidarOptionsHash))
        watchers.set(chokidarOptionsHash, new Map());
    var group = watchers.get(chokidarOptionsHash);
    if (!group.has(id)) {
        var watcher = new FileWatcher(id, chokidarOptions, function () {
            group.delete(id);
        });
        if (watcher.fileExists) {
            group.set(id, watcher);
        }
        else {
            return;
        }
    }
    group.get(id).tasks.add(task);
}
exports.addTask = addTask;
function deleteTask(id, target, chokidarOptionsHash) {
    var group = watchers.get(chokidarOptionsHash);
    var watcher = group.get(id);
    if (watcher) {
        watcher.tasks.delete(target);
        if (watcher.tasks.size === 0) {
            watcher.close();
            group.delete(id);
        }
    }
}
exports.deleteTask = deleteTask;
var FileWatcher = /** @class */ (function () {
    function FileWatcher(id, chokidarOptions, dispose) {
        var _this = this;
        this.tasks = new Set();
        var data;
        try {
            fs.statSync(id);
            this.fileExists = true;
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                // can't watch files that don't exist (e.g. injected
                // by plugins somehow)
                this.fileExists = false;
                return;
            }
            else {
                throw err;
            }
        }
        var handleWatchEvent = function (event) {
            if (event === 'rename' || event === 'unlink') {
                _this.fsWatcher.close();
                _this.trigger();
                dispose();
            }
            else {
                // this is necessary because we get duplicate events...
                var contents = fs.readFileSync(id, 'utf-8');
                if (contents !== data) {
                    data = contents;
                    _this.trigger();
                }
            }
        };
        if (chokidarOptions) {
            this.fsWatcher = chokidar_1.default
                .watch(id, chokidarOptions)
                .on('all', handleWatchEvent);
        }
        else {
            this.fsWatcher = fs.watch(id, opts, handleWatchEvent);
        }
    }
    FileWatcher.prototype.close = function () {
        this.fsWatcher.close();
    };
    FileWatcher.prototype.trigger = function () {
        this.tasks.forEach(function (task) {
            task.makeDirty();
        });
    };
    return FileWatcher;
}());
exports.default = FileWatcher;
