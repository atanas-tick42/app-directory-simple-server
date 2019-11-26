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
const express = require("express");
const path = require("path");
const json = require("comment-json");
const utils_1 = require("./utils");
const app_reader_factory_1 = require("./app-readers/app-reader-factory");
const app_filter_factory_1 = require("./app-filters/app-filter-factory");
const role_reader_factory_1 = require("./role-readers/role-reader-factory");
const role_editor_ui_1 = require("../role-editor-ui");
const app = express();
app.use(function (req, res, next) {
    var nodeSSPI = require('node-sspi');
    var nodeSSPIObj = new nodeSSPI({
        authoritative: true,
        offerSSPI: true,
        offerBasic: false,
        retrieveGroups: true,
        sspiPackagesUsed: ['Negotiate']
    });
    nodeSSPIObj.authenticate(req, res, function (err) {
        res.finished || next();
    });
});
utils_1.readFile(path.resolve(utils_1.assetsDir, 'app-config.json'), 'utf8').then(json.parse)
    .then((config) => {
    console.log('config is ', config);
    const port = config.server.port || 3000;
    let roleEditor = new role_editor_ui_1.RoleEditor(config, utils_1.assetsDir);
    roleEditor.start();
    const appReader = app_reader_factory_1.appReaderFactory(config.appReader.type, config.appReader.config);
    const roleReader = role_reader_factory_1.roleReaderFactory(config.roleReader.type, config.roleReader.config);
    const appFilter = app_filter_factory_1.appFilterFactory(config.appFilter.type, config.appFilter.config);
    app.get('/appd/v1/apps/search', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let userInfo = {
            user: req.connection['user'],
            groups: req.connection['userGroups']
        };
        const allApps = yield appReader.getApps();
        console.log('all apps', allApps.length);
        const userRoles = yield roleReader.getRolesForUser(userInfo);
        console.log('user roles', userRoles);
        const filteredApps = yield appFilter.filterApps(allApps, userRoles);
        console.log('filtered apps', filteredApps.length);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ applications: filteredApps }));
    }));
    app.listen(port, () => {
        return console.log(`Glue42 demo AppD server listening on ${port}.`);
    });
}).catch(err => {
    console.error(err);
});
//# sourceMappingURL=index.js.map