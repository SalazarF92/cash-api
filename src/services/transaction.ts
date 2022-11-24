import { DataSource, Repository } from "typeorm";
import AccountService from "./account";
import { Transaction } from "../entities/transaction.entity";
import { HttpError } from "../error/http";
import validation from "../validation/transaction";
import UserService from "./user";

export default class TransactionService {
  private userService: UserService;
  private accountService: AccountService;
  private transactionRepository: Repository<Transaction>;
  constructor(source: DataSource) {
    this.userService = new UserService(source);
    this.accountService = new AccountService(source);
    this.transactionRepository = source.getRepository(Transaction);
  }

  async create(creditedAccount: string, debitedAccount: string, value: number) {
    const withdrawFromAccount = await this.accountService.findById(
      debitedAccount
    );
    const depositToAccount = await this.accountService.findById(
      creditedAccount
    );

    if (!withdrawFromAccount || !depositToAccount) {
      throw new HttpError(
        404,
        `User Account ${creditedAccount || debitedAccount} not found`
      );
    }

    validation(withdrawFromAccount, depositToAccount, value);

    const { connect, start, rollback, commit, release } =
      await this.accountService.transaction();

    try {
      await connect();
      await start();

      await this.accountService.update(withdrawFromAccount.id, -value);
      await this.accountService.update(depositToAccount.id, +value);

      await commit();

      const transaction = await this.transactionRepository.save(
        this.transactionRepository.create({
          creditedAccount,
          debitedAccount,
          value,
          status: "success",
        })
      );

      return transaction;
      // this.transactionRepository.update(transaction.id, { status: "success" });
    } catch (error) {
      await rollback();

      // this.transactionRepository.update(transaction.id, { status: "failed" });
      throw new HttpError(error.status, error.message);
    } finally {
      await release();
    }
  }

  async filterTransactionsByAccount(userId: string, query: any) {
    const limit = query.limit ?? 10;
    let offset = query.offset;
    const type = query.type;
    if (query.offset) offset = query.offset;
    offset = (offset - 1) * limit;
    const user = await this.userService.findOneById(userId);

    const camelToSnakeCase = (str) =>
      str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    const converted = camelToSnakeCase(type);

    if (type == "creditedAccount" || type == "debitedAccount") {
      const data = await this.transactionRepository.query(
        `
        select t.created_at as "createdAt"
        ,t.id
        ,t.value
        ,t.status
        ,t.credited_account as "creditedAccount"
        ,t.debited_account as "debitedAccount"
        ,u.username as "creditedUser"
        ,u2.username as "debitedUser"
        from transactions as t
        inner join users as u on t.credited_account = u.account_id
        inner join users as u2 on t.debited_account = u2.account_id
        where t.${converted} = $1
        limit $2 offset $3;
        `,
        [user.accountId, limit, offset]
      );

      const total = await this.transactionRepository.query(
        `
        select count(*) from transactions as t
        where t.${converted} = $1;
        `,
        [user.accountId]
      );

      return {
        attributes: data,
        pagination: { limit: parseInt(limit), total: parseInt(total[0].count) },
      };
    }

    const data = await this.transactionRepository.query(
      `
      select t.created_at as "createdAt"
      ,t.id
      ,t.value
      ,t.status
      ,t.credited_account as "creditedAccount"
      ,t.debited_account as "debitedAccount"
      ,u.username as "creditedUser"
      ,u2.username as "debitedUser"
      from transactions as t
      inner join users as u on t.credited_account = u.account_id
      inner join users as u2 on t.debited_account = u2.account_id
      where t.credited_account = $1
      or t.debited_account = $1
      order by t.created_at desc
      limit $2 offset $3;
      `,
      [user.accountId, limit, offset]
    );

    const total = await this.transactionRepository.query(
      `
      select count(*) from transactions as t
      where t.credited_account = $1
      or t.debited_account = $1;
      `,
      [user.accountId]
    );

    return {
      attributes: data,
      pagination: { limit: parseInt(limit), total: parseInt(total[0].count) },
    };
  }
}
