"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const path = require("path");
const json = require("comment-json");
class FileAppReader {
    constructor(config) {
        this.config = config;
    }
    getApps() {
        return utils_1.readDir(path.join(utils_1.assetsDir, this.config.folder))
            .then((files) => {
            return files.map((fileName) => {
                return utils_1.readFile(path.join(utils_1.assetsDir, this.config.folder, fileName), 'utf8').then(json.parse).catch(err => {
                });
            });
        })
            .then((promises) => Promise.all(promises))
            .then((configs) => {
            let appConfigs = configs.reduce((acc, cfg) => acc.concat(Array.isArray(cfg) ? cfg.map(utils_1.configToManifest) : utils_1.configToManifest(cfg)), []);
            return appConfigs;
        })
            .catch((err) => {
            console.log('could not read dir', path.join(utils_1.assetsDir, this.config.folder));
            console.log(err);
        });
    }
}
exports.FileAppReader = FileAppReader;
//# sourceMappingURL=index.js.map