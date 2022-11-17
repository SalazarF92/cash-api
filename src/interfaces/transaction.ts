import { Base } from "./base";

export interface Transaction extends Base {
  username: string;
  password: string;
  accountId: string;
}
