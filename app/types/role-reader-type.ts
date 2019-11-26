export type RoleReader = {
  getRolesForUser(userInfo: UserInfo): Promise<string[]>;
}

export type UserInfo = {
  user: string;
  groups: string[];
}