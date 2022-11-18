import { setupDataSource } from "./db-factory";
import { Transaction } from "@/entities/transaction.entity";
import AccountService from "@/services/account";
import UserService from "@/services/user";
import { DataSource } from "typeorm";
import { Account } from "../entities/account.entity";
import { User } from "../entities/user.entity";
import TransactionService from "../services/transaction";
import authMiddleware from "@/middlewares/authMiddleware";
import { NextFunction, Request, Response } from "express";

describe("TransactionService", () => {
  let source: DataSource;
  let userService: UserService;
  let accountService: AccountService;
  let transactionService: TransactionService;

  beforeAll(async () => {
    source = await setupDataSource([User, Account, Transaction]);
    userService = new UserService(source);
    transactionService = new TransactionService(source);
  });

    beforeEach(async () => {
      jest.setTimeout(20000)
  });


  const user1 = {
    username: "user1",
    password: "12345212121A",
  };

  const user2 = {
    username: "user2",
    password: "2u35089087A328",
  };

  async function createUsers() {
    const account1 = await userService.create(user1);
    const account2 = await userService.create(user2);

    return { account1, account2 };
  }

  it("should create and execute transaction with success", async () => {
    const { account1, account2 } = await createUsers();

    const transaction = await transactionService.create(
      account1.accountId,
      account2.accountId,
      30
    );

    expect(transaction).toBeInstanceOf(Transaction);
  });
});
