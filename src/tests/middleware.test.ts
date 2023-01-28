import authMiddleware from "../middlewares/authMiddleware";
import { DataSource } from "typeorm";
import { Account } from "../infra/database/entities/account.entity";
import { User } from "../infra/database/entities/user.entity";
import UserServiceDB from "../infra/database/services/user";
import { setupDataSource } from "./db-factory";
import { NextFunction, Request, Response } from "express";
import { UserProps } from "@/application/types/interfaces";
import { Replace } from "@/common/helpers/Replace";

describe("AccountService", () => {
  let source: DataSource;
  let userService: UserServiceDB;

  beforeAll(async () => {
    source = await setupDataSource([User, Account]);
    userService = new UserServiceDB(source);
  });

  // beforeEach(async () => {
  //   jest.useFakeTimers();
  // });

  afterAll(async () => {
    await source.destroy();
  });

  const rightUser = {
    username: "arii",
    password: "12345212121A",
  };

  async function createUser(user: Replace<UserProps , { id?: string }>)  {
    const account = await userService.create(user);
    return account;
  }

  let req: Request;
  let res: Response;
  let next: NextFunction;

  it("should return validation in authMiddleware", async () => {
    const user = await createUser(rightUser);
    const sessionToken = await userService.login({username: user!.username, password: rightUser!.password});

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
