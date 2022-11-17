import { DataSource } from "typeorm";
import { Account } from "../entities/account";
import { User } from "../entities/user";
import UserService from "../services/user";
import { setupDataSource } from "./db-factory";

describe("TransactionService", async () => {
  let source: DataSource;
  let userService: UserService;

  beforeAll(async () => {
    source = await setupDataSource([User, Account]);
    userService = new UserService(source);
  });

  const account1 = {
    username: "account1",
    password: "12345678",
  };

  const account2 = {
    username: "account2",
    password: "98765432",
  };

  const creditAccout = await userService.create(account1);
  const debitAccount = await userService.create(account2);

  it("should return a valid instance", async () => {

    // expect(create).toBeInstanceOf(User);
  });

  it("should return a session token", async () => {
    // const login = await userService.login(data.username, data.password);

    // expect(typeof login).toBe("string");
  });
});
