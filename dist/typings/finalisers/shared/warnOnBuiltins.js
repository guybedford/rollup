"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builtins = {
    process: true,
    events: true,
    stream: true,
    util: true,
    path: true,
    buffer: true,
    querystring: true,
    url: true,
    string_decoder: true,
    punycode: true,
    http: true,
    https: true,
    os: true,
    assert: true,
    constants: true,
    timers: true,
    console: true,
    vm: true,
    zlib: true,
    tty: true,
    domain: true
};
// Creating a browser chunk that depends on Node.js built-in modules ('util'). You might need to include https://www.npmjs.com/package/rollup-plugin-node-builtins
function warnOnBuiltins(chunk) {
    var externalBuiltins = chunk.dependencies
        .map(function (module) { return module.id; })
        .filter(function (id) { return id in builtins; });
    if (!externalBuiltins.length)
        return;
    var detail = externalBuiltins.length === 1
        ? "module ('" + externalBuiltins[0] + "')"
        : "modules (" + externalBuiltins
            .slice(0, -1)
            .map(function (name) { return "'" + name + "'"; })
            .join(', ') + " and '" + externalBuiltins.slice(-1) + "')";
    chunk.graph.warn({
        code: 'MISSING_NODE_BUILTINS',
        modules: externalBuiltins,
        message: "Creating a browser bundle that depends on Node.js built-in " + detail + ". You might need to include https://www.npmjs.com/package/rollup-plugin-node-builtins"
    });
}
exports.default = warnOnBuiltins;
