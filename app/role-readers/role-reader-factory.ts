import { RoleReader } from "../types/role-reader-type";
import { SQLiteRoleReader } from "./sqlite-role-reader";
import {LDAPRoleReader} from './ldap-role-reader';

export function roleReaderFactory(type: string, config: any): RoleReader {
  if (type === 'SQLite') {
    return new SQLiteRoleReader(config);
  } else if (type === 'ActiveDirectory') {
    return new LDAPRoleReader(config);
  } else {
    throw new Error('Invalid RoleReader type: ' + type);
  }
}