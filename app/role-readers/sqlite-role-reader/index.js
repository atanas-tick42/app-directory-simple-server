"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const path = require("path");
const utils_1 = require("../../utils");
const sqlite = sqlite3.verbose();
const rolesForUserQuery = `Select users.id, users.username, GROUP_CONCAT('[' || roles.id || ',"' || roles.name || '"]') as roles
from users
LEFT OUTER JOIN user_roles on users.id = user_roles.user_id
INNER JOIN roles on user_roles.role_id = roles.id
where users.username = $username
group by users.id`;
class SQLiteRoleReader {
    constructor(config) {
        this.db = new sqlite.Database(path.join(utils_1.assetsDir, config.db));
    }
    getRolesForUser(userInfo) {
        return new Promise((res, rej) => {
            this.db.get(rolesForUserQuery, { $username: userInfo.user }, (err, row) => {
                if (err) {
                    rej(err);
                }
                else {
                    if (row) {
                        let roles = JSON.parse(`[${row.roles}]`).map((role) => role[1]);
                        res(roles);
                    }
                    else {
                        res([]);
                    }
                }
            });
        });
    }
}
exports.SQLiteRoleReader = SQLiteRoleReader;
//# sourceMappingURL=index.js.map