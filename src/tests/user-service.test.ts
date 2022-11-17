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

  const data = {
    username: "ar",
    password: "12345212121A",
  };

  // it("should match username with at least 3 characters", async () => {

  // });

  // it("should match password at least 8 characters with 1 capital letter and 1 number", async () => {
  // });

  it("should return a valid instance", async () => {
    const create = await userService.create(data);

    expect(create.username.length).toBeGreaterThanOrEqual(3);
    expect(create.password).toMatch(/^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/);
    expect(create).toBeInstanceOf(User);

  });

  it("should return a session token", async () => {
    const login = await userService.login(data.username, data.password);

    expect(typeof login).toBe("string");
  });
});
