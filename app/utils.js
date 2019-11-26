"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const path = require("path");
const readDir = util.promisify(fs.readdir);
exports.readDir = readDir;
const readFile = util.promisify(fs.readFile);
exports.readFile = readFile;
const isDev = !!process.argv.find(arg => arg === '--dev');
exports.isDev = isDev;
const assetsDir = isDev ? path.join(__dirname, '../assets') : path.join(path.dirname(process.execPath), '/assets');
exports.assetsDir = assetsDir;
console.log(assetsDir, 1);
console.log(5);
const configToManifest = (config) => {
    return {
        appId: config.name,
        name: config.name,
        version: "1",
        title: config.title,
        manifestType: "Glue42",
        manifest: JSON.stringify(config)
    };
};
exports.configToManifest = configToManifest;
//# sourceMappingURL=utils.js.map