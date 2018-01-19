"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this looks ridiculous, but it prevents sourcemap tooling from mistaking
// this for an actual sourceMappingURL
var SOURCEMAPPING_URL = 'sourceMa';
exports.SOURCEMAPPING_URL = SOURCEMAPPING_URL;
exports.SOURCEMAPPING_URL = SOURCEMAPPING_URL += 'ppingURL';
var SOURCEMAPPING_URL_RE = new RegExp("^#\\s+" + SOURCEMAPPING_URL + "=.+\\n?");
exports.SOURCEMAPPING_URL_RE = SOURCEMAPPING_URL_RE;
