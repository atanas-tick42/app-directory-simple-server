"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_app_reader_1 = require("./file-app-reader");
const http_app_reader_1 = require("./http-app-reader");
function appReaderFactory(type, config) {
    if (type === 'file') {
        return new file_app_reader_1.FileAppReader(config);
    }
    else if (type === 'url') {
        return new http_app_reader_1.HttpAppReader(config);
    }
    throw new Error(`Unknown app reader type "${type}"`);
}
exports.appReaderFactory = appReaderFactory;
//# sourceMappingURL=app-reader-factory.js.map