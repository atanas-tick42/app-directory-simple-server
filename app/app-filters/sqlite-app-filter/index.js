"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const path = require("path");
const utils_1 = require("../../utils");
const sqlite = sqlite3.verbose();
const appsForRolesQuery = `SELECT roles.id, roles.name, GROUP_CONCAT('['||applications.id || ', "' || applications.name || '", "' || applications.display_name || '"]', ',') as apps
from roles
LEFT OUTER JOIN applications_for_role on applications_for_role.role_id = roles.id
INNER JOIN applications on applications_for_role.application_id = applications.id
WHERE roles.name IN ?
GROUP BY roles.id`;
class SQLiteAppFilter {
    constructor(config) {
        this.config = config;
        this.db = new sqlite.Database(path.join(utils_1.assetsDir, config.db));
    }
    filterApps(apps, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedAppsPerRole = yield this.getAppsForRoles(roles);
            // this.config.defaultApps
            return apps.filter(app => {
                // console.log(app.appId, this.config.defaultApps.indexOf(app.appId) >= 0);
                return allowedAppsPerRole.find(allowedApp => allowedApp.name === app.appId) || (this.config.defaultApps.indexOf(app.appId) >= 0);
            });
        });
    }
    getAppsForRoles(roles) {
        return new Promise((res, rej) => {
            let q = appsForRolesQuery.replace('?', `('${roles.join("', '")}')`);
            this.db.all(q, (err, rows) => {
                if (err) {
                    rej(err);
                }
                else {
                    let allApps = [];
                    rows.forEach(row => {
                        allApps = allApps.concat(JSON.parse(`[${row.apps}]`));
                    });
                    allApps = allApps.map((rawApp) => {
                        return {
                            name: rawApp[1],
                            title: rawApp[2]
                        };
                    });
                    res(allApps);
                }
            });
        });
    }
}
exports.SQLiteAppFilter = SQLiteAppFilter;
//# sourceMappingURL=index.js.map