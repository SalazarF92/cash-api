import { setupDataSource } from "./db-factory";
import { Transaction } from "../infra/database/entities/transaction.entity";
import UserServiceDB from "../infra/database/services/user";
import { DataSource } from "typeorm";
import { Account } from "../infra/database/entities/account.entity";
import { User } from "../infra/database/entities/user.entity";
import TransactionServiceDB from "../infra/database/services/transaction";

describe("TransactionService", () => {
  let source: DataSource;
  let userService: UserServiceDB;
  let transactionService: TransactionServiceDB;

  beforeAll(async () => {
    source = await setupDataSource([User, Account, Transaction]);
    userService = new UserServiceDB(source);
    transactionService = new TransactionServiceDB(source);
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
      account1!.accountId,
      account2!.accountId,
      30
    );

    expect(transaction).toBeInstanceOf(Transaction);
  });
});
