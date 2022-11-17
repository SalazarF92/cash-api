import { Base } from "./base";

export interface User extends Base {
  username: string;
  password: string;
  accountId: string;
}
