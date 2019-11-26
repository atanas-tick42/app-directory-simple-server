import { AppFilter } from "../../types/app-filter-type";
import { FDC3AppConfig } from "../../types/fdc3-app-config";
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import { assetsDir } from "../../utils";

const sqlite = sqlite3.verbose();

const appsForRolesQuery = `SELECT roles.id, roles.name, GROUP_CONCAT('['||applications.id || ', "' || applications.name || '", "' || applications.display_name || '"]', ',') as apps
from roles
LEFT OUTER JOIN applications_for_role on applications_for_role.role_id = roles.id
INNER JOIN applications on applications_for_role.application_id = applications.id
WHERE roles.name IN ?
GROUP BY roles.id`;

class SQLiteAppFilter implements AppFilter {
  private config: any;
  private db: sqlite3.Database;

  constructor(config: any) {
    this.config = config;
    this.db =  new sqlite.Database(path.join(assetsDir, config.db));
  }

  async filterApps(apps: FDC3AppConfig[], roles: string[]): Promise<FDC3AppConfig[]> {
    const allowedAppsPerRole = await this.getAppsForRoles(roles)
    // this.config.defaultApps
    return apps.filter(app => {
      // console.log(app.appId, this.config.defaultApps.indexOf(app.appId) >= 0);
      return allowedAppsPerRole.find(allowedApp => allowedApp.name === app.appId) || (this.config.defaultApps.indexOf(app.appId) >= 0);
    })
  }

  private getAppsForRoles(roles: Array<string>): Promise<Array<any>> {
    return new Promise((res, rej) => {
      let q = appsForRolesQuery.replace('?', `('${roles.join("', '")}')`)
      this.db.all(q, (err, rows) => {
        if(err) {
          rej(err)
        } else {
          let allApps: any = [];
          rows.forEach(row => {
            allApps = allApps.concat(JSON.parse(`[${row.apps}]`))
          });

          allApps = allApps.map((rawApp: any) => {
            return {
              name: rawApp[1],
              title: rawApp[2]
            }
          });

          res(allApps);
        }
      })
    });
  }
}


export {
  SQLiteAppFilter
}