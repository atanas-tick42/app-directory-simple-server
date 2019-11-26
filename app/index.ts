import * as express from 'express';
import * as path from 'path';

import * as json from 'comment-json';
import { readFile, assetsDir } from './utils';
import { appReaderFactory } from './app-readers/app-reader-factory';
import { appFilterFactory } from './app-filters/app-filter-factory';
import { roleReaderFactory } from './role-readers/role-reader-factory';
import { UserInfo } from './types/role-reader-type';

const app = express();

app.use(function (req, res, next) {
    var nodeSSPI = require('node-sspi')
    var nodeSSPIObj = new nodeSSPI({
        authoritative: true,
        offerSSPI: true,
        offerBasic: false,
        retrieveGroups: true,
        sspiPackagesUsed: ['Negotiate']
    })
    nodeSSPIObj.authenticate(req, res, function (err) {
        res.finished || next()
    })
})

readFile(path.resolve(assetsDir, 'app-config.json'), 'utf8').then(json.parse)
    .then((config) => {
        console.log('config is ', config);
        const port = config.server.port || 3000;

        const appReader = appReaderFactory(config.appReader.type, config.appReader.config);
        const roleReader = roleReaderFactory(config.roleReader.type, config.roleReader.config);
        const appFilter = appFilterFactory(config.appFilter.type, config.appFilter.config);

        app.get('/appd/v1/apps/search', async (req: any, res: any, next: any) => {
            let userInfo: UserInfo = {
                user: req.connection['user'],
                groups: req.connection['userGroups']
            }

            const allApps = await appReader.getApps();
            console.log('all apps', allApps.length)

            const userRoles = await roleReader.getRolesForUser(userInfo);
            console.log('user roles', userRoles);

            const filteredApps = await appFilter.filterApps(allApps, userRoles);
            console.log('filtered apps', filteredApps.length);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({applications: filteredApps}));
        });

        app.listen(port, () => {
            return console.log(`Glue42 demo AppD server listening on ${port}.`)
        });
    }).catch(err => {
        console.error(err);
    })


