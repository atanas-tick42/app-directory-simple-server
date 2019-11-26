import { RoleReader, UserInfo } from "../../types/role-reader-type";

export class LDAPRoleReader implements RoleReader {

  constructor(config: any) {
  }

  getRolesForUser(userInfo: UserInfo): Promise<string[]> {
    return new Promise((res, rej) => {
      res(userInfo.groups);
    })
  }
}