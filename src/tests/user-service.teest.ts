import { DataSource } from "typeorm";
import { Account } from "../entities/account";
import { User } from "../entities/user";
import UserService from "../services/user";
import { setupDataSource } from "./db-factory";

describe("AccountService", () => {
  let source: DataSource;
  let userService: UserService;

  beforeAll(async () => {
    source = await setupDataSource([User, Account]);
    userService = new UserService(source);
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

  async function createUser(data) {
    const account = await userService.create(data);

    return account;
  }

  // it("should match username with at least 3 characters", async () => {
  //   const account = await createUser();

  //   expect(account.username.length).toBeGreaterThanOrEqual(3);
  //   await source.dropDatabase();
  // });

  // it("should match password at least 8 characters with 1 capital letter and 1 number", async () => {
  //   const account = await createUser();

  //   expect(account.password).toMatch(/^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
  // });

  it("should return a valid instance", async () => {
    const account = await createUser(data);

    expect(account.username.length).toBeGreaterThanOrEqual(3);
    expect(account.password).toMatch(/^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
    expect(account).toBeInstanceOf(User);
  });

  it("should return a session token", async () => {
    await createUser(data2);
    const login = await userService.login(data.username, data.password);

    expect(typeof login).toBe("string");
  });
});
