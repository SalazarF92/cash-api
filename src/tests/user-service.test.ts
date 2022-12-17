import { UserProps } from "@/application/types/interfaces";
import { Replace } from "@/helpers/Replace";
import { resolvePromise } from "@/helpers/Resolve";
import { DataSource } from "typeorm";
import { Account } from "../infra/database/entities/account.entity";
import { User } from "../infra/database/entities/user.entity";
import UserServiceDB from "../infra/database/services/user";
import { setupDataSource } from "./db-factory";

describe("AccountService", () => {
  let source: DataSource;
  let userService: UserServiceDB;

  beforeAll(async () => {
    source = await setupDataSource([User, Account]);
    userService = new UserServiceDB(source);
  });

  afterAll(async () => {
    await source.destroy();
  });

  const data = {
    username: "arii",
    password: "12345212121A",
  };

  const data2 = {
    username: "arii1",
    password: "12345212121A1",
  };

  const wrongUser = {
    username: "ar",
    password: "12345",
  };

  async function createUser(data: Replace<UserProps, { id?: string }>) {
    const [account, error] = await resolvePromise(userService.create(data));

    return error ? error : account;
  }

  it("should return a valid data of user", async () => {
    const account = await createUser(data);

    expect(account!.username.length).toBeGreaterThanOrEqual(3);
    expect(data.password).toMatch(/^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
    expect(account).toBeInstanceOf(User);
  });

  it("should return a session token", async () => {
    await createUser(data2);
    const login = await userService.login({
      username: data!.username,
      password: data!.password,
    });

    expect(typeof login).toBe("string");
  });

  it("should throw an error to create if username or password not match pre requirements", async () => {
    const result = await createUser(wrongUser);
    expect(result).toBeInstanceOf(Error);
  });
});
