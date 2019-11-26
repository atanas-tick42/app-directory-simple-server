"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LDAPRoleReader {
    constructor(config) {
    }
    getRolesForUser(userInfo) {
        return new Promise((res, rej) => {
            res(userInfo.groups);
        });
    }
}
exports.LDAPRoleReader = LDAPRoleReader;
//# sourceMappingURL=index.js.map