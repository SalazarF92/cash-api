import authMiddleware from "../middlewares/authMiddleware";
import { DataSource } from "typeorm";
import { Account } from "../entities/account.entity";
import { User } from "../entities/user.entity";
import UserService from "../services/user";
import { setupDataSource } from "./db-factory";
import { NextFunction, Request, Response } from "express";

describe("AccountService", () => {
  let source: DataSource;
  let userService: UserService;

  beforeAll(async () => {
    source = await setupDataSource([User, Account]);
    userService = new UserService(source);
  });

  // beforeEach(async () => {
  //   jest.useFakeTimers();
  // });

  afterAll(async () => {
    await source.destroy();
  });

  const data = {
    username: "arii",
    password: "12345212121A",
  };

  async function createUser() {
    const account = await userService.create(data);

    return account;
  }

  let req: Request;
  let res: Response;
  let next: NextFunction;

  it("should return validation in authMiddleware", async () => {
    await createUser();
    const sessionToken = await userService.login(data.username, data.password);

    req = {
      headers: {
        authorization: "Bearer " + sessionToken,
      },
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    next = jest.fn();

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
