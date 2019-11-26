// import * as http from 'http';
import * as express from 'express';
import * as sqlite3 from "sqlite3";
import * as path from 'path';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';

const sqlite = sqlite3.verbose();

export class RoleEditor {
  private db: sqlite3.Database;
  private expressApp: any;
  private assetsDir;


  constructor() {
    const isDev = !!process.argv.find(arg => arg === '--dev');
    this.assetsDir = isDev ? path.join(__dirname, '../assets') : path.join(path.dirname(process.execPath), '/assets')
    const config: any = JSON.parse(fs.readFileSync(path.join(this.assetsDir, 'app-config.json'), 'utf-8'));

    let appFilterConfig = config.appFilter.config;
    this.db = new sqlite.Database(path.join(this.assetsDir, appFilterConfig.db))
    this.startServer(config.server.roleEditorPort);
  }

  start() {

  }

  private startServer(port = 3001) {
    let isDev = process.argv.find(arg => arg === '--dev');
    let publicPath = isDev ? path.join(this.assetsDir, '..', 'role-editor-ui', 'public') : path.join(this.assetsDir, '..', 'role-editor-ui');
    this.expressApp = express();
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(express.static(publicPath));
    this.registerEndPoints();
    this.expressApp.listen(port, () => {
      console.log('Role Editor server started on port '+ port);
    })
  }

  private registerEndPoints() {
    this.expressApp.get('/apps', this.getApps.bind(this));
    this.expressApp.get('/users', this.getUsers.bind(this));
    this.expressApp.get('/roles', this.getRoles.bind(this));
    this.expressApp.put('/add-role-for-user', this.addRoleForUser.bind(this));
    this.expressApp.put('/remove-role-for-user', this.removeRoleForUser.bind(this));
    this.expressApp.put('/add-app-for-role', this.addAppForRole.bind(this));
    this.expressApp.put('/remove-app-for-role', this.removeAppForRole.bind(this));
  }

  private getApps(req, res) {
    this.db.all(appsQuery, (err, apps) => {
      res.json(apps);
    })
  }

  private getUsers(req, res) {
    this.db.all(usersQuery, (err, users) => {
      let grouped = users.reduce((acc, curr) => {
        acc[curr.userName] = acc[curr.userName] || {id: curr.userId, name: curr.userName, roles:[]};
        if (curr.roleName) {
          acc[curr.userName].roles.push(curr.roleName);
        }
        return acc;
      }, {});

      res.json(Object.keys(grouped).map(userName => grouped[userName]));
    })

  }

  private getRoles(req, res) {
    this.db.all(rolesQuery, (err, roles) => {

      let grouped = roles.reduce((acc, curr) => {
        acc[curr.roleName] = acc[curr.roleName] || {id: curr.roleId, name: curr.roleName, apps:[]};
        if (curr.appName) {
          acc[curr.roleName].apps.push({id: curr.appId, name: curr.appName, displayName: curr.appDisplayName});
        }
        return acc;
      }, {});

      res.json(Object.keys(grouped).map(userName => grouped[userName]));
    })
  }

  private addRoleForUser(req, res) {
    let {userId, roleId} = req.body;
    if (typeof userId !== 'number' || typeof roleId !== 'number') {
      res.status(400);
      res.json('Invalid input data');
    }

    let addUserRoleQuery = `
    INSERT INTO user_roles
    VALUES (${userId}, ${roleId})`;
    this.db.run(addUserRoleQuery,(err, result) => {
      if(err) {
        res.status(400);
        res.json(err);
      } else {
        res.json(result);
      }
    })
  }

  private removeRoleForUser(req, res) {
    let {userId, roleId} = req.body;
    if (typeof userId !== 'number' || typeof roleId !== 'number') {
      res.status(400);
      res.json('Invalid input data');
    }

    let removeUserRoleQuery = `
    DELETE FROM user_roles
    WHERE user_id=${userId} AND role_id=${roleId}`;
    this.db.run(removeUserRoleQuery, (err, result) => {
      if(err) {
        res.status(400);
        res.json(err);
      } else {
        res.json(result);
      }
    })
  }

  private addAppForRole(req, res) {
    console.log('addAppForRole', req.body);
    let {appId, roleId} = req.body;
    if (typeof appId !== 'number' || typeof roleId !== 'number') {
      res.status(400);
      res.json('Invalid inputdata')
    }

    let addAppForRoleQuery = `INSERT INTO applications_for_role
    VALUES (${roleId}, ${appId});`;
    this.db.run(addAppForRoleQuery, (err, result) => {
      if (err) {
        res.status(400);
        res.json(err);
      } else {
        res.json(result);
      }
    })
  }

  private removeAppForRole(req, res) {
    console.log('removeAppForRole', req.body);
    let {appId, roleId} = req.body;
    if (typeof appId !== 'number' || typeof roleId !== 'number') {
      res.status(400);
      res.json('Invalid inputdata')
    }

    let removeAppForRoleQuery = `DELETE FROM applications_for_role
    WHERE application_id=${appId} AND role_id=${roleId}`;
    this.db.run(removeAppForRoleQuery, (err, result) => {
      if (err) {
        res.status(400);
        res.json(err);
      } else {
        res.json(result);
      }
    })
  }
}

// @ts-ignore
let roleEditor = new RoleEditor();

const appsQuery = `SELECT applications.id as id, applications.name as name, applications.display_name as displayName
FROM applications`;

const usersQuery = `SELECT users.id as userId, users.username as userName, roles.name as roleName, roles.id as roleId
FROM users
LEFT OUTER JOIN user_roles ON user_roles.user_id = users.id
LEFT OUTER JOIN roles on user_roles.role_id = roles.id`;

const rolesQuery = `SELECT roles.id as roleId, roles.name as roleName, applications.id as appId, applications.name as appName, applications.display_name as appDisplayName
FROM roles
LEFT OUTER JOIN applications_for_role ON applications_for_role.role_id = roles.id
LEFT OUTER JOIN applications ON applications.id = applications_for_role.application_id`;