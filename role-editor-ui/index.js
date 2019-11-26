"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as http from 'http';
const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const sqlite = sqlite3.verbose();
class RoleEditor {
    constructor(config, assetsDir) {
        this.assetsDir = assetsDir;
        let appFilterConfig = config.appFilter.config;
        this.db = new sqlite.Database(path.join(assetsDir, appFilterConfig.db));
        this.startServer(config.server.appEditorPort);
    }
    start() {
    }
    startServer(port = 3001) {
        let isDev = process.argv.find(arg => arg === '--dev');
        let publicPath = isDev ? path.join(this.assetsDir, '..', 'role-editor-ui', 'public') : path.join(this.assetsDir, '..', 'role-editor-ui');
        this.expressApp = express();
        this.expressApp.use(express.static(publicPath));
        this.expressApp.use(express.json());
        this.registerEndPoints();
        this.expressApp.listen(port, () => {
            console.log('Role Editor server started on port ' + port);
            console.log('serving path: ', publicPath);
        });
    }
    registerEndPoints() {
        this.expressApp.get('/apps', this.getApps.bind(this));
        this.expressApp.get('/users', this.getUsers.bind(this));
        this.expressApp.get('/roles', this.getRoles.bind(this));
        this.expressApp.put('/add-role-for-user', this.addRoleForUser.bind(this));
        this.expressApp.put('/remove-role-for-user', this.removeRoleForUser.bind(this));
        this.expressApp.put('/add-app-for-role', this.addAppForRole.bind(this));
        this.expressApp.put('/remove-app-for-role', this.removeAppForRole.bind(this));
    }
    getApps(req, res) {
        this.db.all(appsQuery, (err, apps) => {
            res.json(apps);
        });
    }
    getUsers(req, res) {
        this.db.all(usersQuery, (err, users) => {
            let grouped = users.reduce((acc, curr) => {
                acc[curr.userName] = acc[curr.userName] || { id: curr.userId, name: curr.userName, roles: [] };
                if (curr.roleName) {
                    acc[curr.userName].roles.push(curr.roleName);
                }
                return acc;
            }, {});
            res.json(Object.keys(grouped).map(userName => grouped[userName]));
        });
    }
    getRoles(req, res) {
        this.db.all(rolesQuery, (err, roles) => {
            let grouped = roles.reduce((acc, curr) => {
                acc[curr.roleName] = acc[curr.roleName] || { id: curr.roleId, name: curr.roleName, apps: [] };
                if (curr.appName) {
                    acc[curr.roleName].apps.push({ id: curr.appId, name: curr.appName, displayName: curr.appDisplayName });
                }
                return acc;
            }, {});
            res.json(Object.keys(grouped).map(userName => grouped[userName]));
        });
    }
    addRoleForUser(req, res) {
        let { userId, roleId } = req.body;
        if (typeof userId !== 'number' || typeof roleId !== 'number') {
            res.status(400);
            res.json('Invalid input data');
        }
        let addUserRoleQuery = `
    INSERT INTO user_roles
    VALUES (${userId}, ${roleId})`;
        this.db.run(addUserRoleQuery, (err, result) => {
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    removeRoleForUser(req, res) {
        let { userId, roleId } = req.body;
        if (typeof userId !== 'number' || typeof roleId !== 'number') {
            res.status(400);
            res.json('Invalid input data');
        }
        let removeUserRoleQuery = `
    DELETE FROM user_roles
    WHERE user_id=${userId} AND role_id=${roleId}`;
        this.db.run(removeUserRoleQuery, (err, result) => {
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    addAppForRole(req, res) {
        let { appId, roleId } = req.body;
        if (typeof appId !== 'number' || typeof roleId !== 'number') {
            res.status(400);
            res.json('Invalid inputdata');
        }
        let addAppForRoleQuery = `INSERT INTO applications_for_role
    VALUES (${roleId}, ${appId});`;
        this.db.run(addAppForRoleQuery, (err, result) => {
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    removeAppForRole(req, res) {
        let { appId, roleId } = req.body;
        if (typeof appId !== 'number' || typeof roleId !== 'number') {
            res.status(400);
            res.json('Invalid inputdata');
        }
        let removeAppForRoleQuery = `DELETE FROM applications_for_role
    WHERE application_id=${appId} AND role_id=${roleId}`;
        this.db.run(removeAppForRoleQuery, (err, result) => {
            if (err) {
                res.status(400);
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
}
exports.RoleEditor = RoleEditor;
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
//# sourceMappingURL=index.js.map