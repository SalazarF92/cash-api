import validateTransaction from "@/common/validation/transaction";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { HttpError } from "../../../error/http";
import { Account } from "../entities/account.entity";

export default class AccountService {
  private accountRepository: Repository<Account>;
  private queryRunner: QueryRunner | undefined;
  constructor(source: DataSource) {
    this.accountRepository = source.getRepository(Account);
    this.queryRunner = source.createEntityManager().queryRunner;
  }

  async create() {
    const account = await this.accountRepository.save(
      this.accountRepository.create({
        balance: 100,
      })
    );
    return account.id;
  }

  async getAll(id: string) {
    const accounts = await this.accountRepository.query(
      `
      select acc.*
      ,u.username
      from accounts as acc 
      inner join users as u on acc.id = u.account_id
      where acc.id != $1;
    `,
      [id]
    );

    return accounts;
  }

  async findById(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
    });

    if (!account) throw new HttpError(404, "Account not found");

    return account;
  }

  async transaction() {
    this.queryRunner =
      this.accountRepository.manager.connection.createQueryRunner();
    return {
      connect: () => this.queryRunner?.connect(),
      start: () => this.queryRunner?.startTransaction(),
      commit: () => this.queryRunner?.commitTransaction(),
      rollback: () => this.queryRunner?.rollbackTransaction(),
      release: () => this.queryRunner?.release(),
    };
  }

  async validation(
    debitedAccount: string,
    creditedAccount: string,
    value: number
  ): Promise<{withdrawFromAccount: Account, depositToAccount: Account, value: number}> {
    try {
      const withdrawFromAccount = await this.findById(debitedAccount);
      const depositToAccount = await this.findById(creditedAccount);
      if (!withdrawFromAccount || !depositToAccount) {
        throw new HttpError(
          404,
          `User Account ${creditedAccount || debitedAccount} not found`
        );
      }
      const result = validateTransaction(withdrawFromAccount, depositToAccount, value);
      if (result[1]) throw new HttpError(result[1].status, result[1].message);
      return { withdrawFromAccount, depositToAccount, value };
    } catch (error: any) {
      throw new HttpError(error.status, error.message);
    }
  }

  async update(id: string, value: number) {
    const account = await this.findById(id);

    account.balance = account.balance + value;

    await this.queryRunner?.manager.save(account);

    return true;
  }
}
