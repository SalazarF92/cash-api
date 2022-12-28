import { DataSource, Repository } from "typeorm";
import AccountService from "./account";
import { Transaction } from "../entities/transaction.entity";
import { HttpError } from "../../../error/http";
import UserServiceDB from "./user";
import { TransactionService } from "@/application/service-repositories/transaction.repository";
import RabbitService from "../../queue/queue";
import { Payload } from "@/application/types/interfaces";

export default class TransactionServiceDB implements TransactionService {
  private userService: UserServiceDB;
  private accountService: AccountService;
  private queueService: RabbitService;
  private transactionRepository: Repository<Transaction>;
  constructor(source: DataSource) {
    this.userService = new UserServiceDB(source);
    this.accountService = new AccountService(source);
    this.queueService = new RabbitService();
    this.transactionRepository = source.getRepository(Transaction);
  }

  async postInQueue(payload: Payload) {
    try {
      await this.queueService.publishInQueue({
        topic: "transaction",
        queue: "transaction",
        payload,
      });
      await this.queueService.publishInExchange({
        exchange: "ngcash",
        topic: "transaction",
        queue: "transaction",
        payload,
      });
      await this.queueService.consumeInterval(
        "transaction",
        async (msg: any) => {
          const { creditedAccount, debitedAccount, value } = JSON.parse(
            msg.content.toString()
          );

          try {
            await this.create(creditedAccount, debitedAccount, value);
            return [true, null];
          } catch (error) {
            return [null, error];
          }
        },
        2000
      );
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }

  async consumeQueueTransaction() {
    const messages: any = [];
    await this.queueService.consume("transaction", async (msg: any) => {
      const { creditedAccount, debitedAccount, value } = JSON.parse(
        msg.content.toString()
      );

      await this.create(creditedAccount, debitedAccount, value);
      messages.push(JSON.parse(msg.content.toString()));
    });

    return messages;
  }

  async create(creditedAccount: string, debitedAccount: string, value: number) {
    const transaction = await this.accountService.validation(
      debitedAccount,
      creditedAccount,
      value
    );
    const { withdrawFromAccount, depositToAccount } = transaction;

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
    } catch (error: any) {
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

    const camelToSnakeCase = (str: string) =>
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
        [user!.accountId, limit, offset]
      );

      const total = await this.transactionRepository.query(
        `
        select count(*) from transactions as t
        where t.${converted} = $1;
        `,
        [user!.accountId]
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
      [user!.accountId, limit, offset]
    );

    const total = await this.transactionRepository.query(
      `
      select count(*) from transactions as t
      where t.credited_account = $1
      or t.debited_account = $1;
      `,
      [user!.accountId]
    );

    return {
      attributes: data,
      pagination: { limit: parseInt(limit), total: parseInt(total[0].count) },
    };
  }
}
