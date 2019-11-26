"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_app_filter_1 = require("./sqlite-app-filter");
function appFilterFactory(type, config) {
    if (type === 'SQLite') {
        return new sqlite_app_filter_1.SQLiteAppFilter(config);
    }
    throw new Error(`Unknown app filter type "${type}"`);
}
exports.appFilterFactory = appFilterFactory;
//# sourceMappingURL=app-filter-factory.js.map