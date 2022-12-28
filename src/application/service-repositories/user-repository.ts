import { UserProps } from "../types/interfaces";

export abstract class UserService {
  abstract login({ username, password }: UserProps): Promise<any>;
  abstract create({ username, password }: UserProps): Promise<any>;
  abstract findOneById(id: string, withPasword: boolean): Promise<any>;
  abstract generateSessionToken(payload: any): Promise<any>;
}
