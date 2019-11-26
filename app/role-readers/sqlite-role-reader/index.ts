import { RoleReader } from "../../types/role-reader-type";
import * as sqlite3 from "sqlite3";
import * as path from 'path';
import { assetsDir } from "../../utils";

const sqlite = sqlite3.verbose();

const rolesForUserQuery = `Select users.id, users.username, GROUP_CONCAT('[' || roles.id || ',"' || roles.name || '"]') as roles
from users
LEFT OUTER JOIN user_roles on users.id = user_roles.user_id
INNER JOIN roles on user_roles.role_id = roles.id
where users.username = $username
group by users.id`;

export class SQLiteRoleReader implements RoleReader {
  private db: sqlite3.Database;

  constructor(config: any) {
    this.db =  new sqlite.Database(path.join(assetsDir, config.db));
  }

  getRolesForUser(userInfo: {user: string, groups: string[]}): Promise<string[]> {
    return new Promise((res, rej) => {

      this.db.get(rolesForUserQuery, {$username: userInfo.user}, (err, row) => {
        if (err) {
          rej(err);
        } else {
          if (row) {
            let roles = JSON.parse(`[${row.roles}]`).map((role: Array<any>) => role[1]);
            res(roles)
          } else {
            res([]);
          }
        }
      });
    })
  }
}