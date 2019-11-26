"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_role_reader_1 = require("./sqlite-role-reader");
const ldap_role_reader_1 = require("./ldap-role-reader");
function roleReaderFactory(type, config) {
    if (type === 'SQLite') {
        return new sqlite_role_reader_1.SQLiteRoleReader(config);
    }
    else if (type === 'ActiveDirectory') {
        return new ldap_role_reader_1.LDAPRoleReader(config);
    }
    else {
        throw new Error('Invalid RoleReader type: ' + type);
    }
}
exports.roleReaderFactory = roleReaderFactory;
//# sourceMappingURL=role-reader-factory.js.map