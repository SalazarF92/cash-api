import { DataSource, Repository } from "typeorm";
import { HttpError } from "../error/http";
import { Account } from "../entities/account";

export default class AccountService {
  private accountRepository: Repository<Account>;
  private queryRunner = null;
  constructor(source: DataSource) {
    this.accountRepository = source.getRepository(Account);
    this.queryRunner =
      this.accountRepository.manager.connection.createQueryRunner();
  }

  async create() {
    const account = await this.accountRepository.save(
      this.accountRepository.create({
        balance: 100,
      })
    );
    return account.id;
  }

  async findById(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
    });

    if (!account) throw new HttpError(404, "Account not found");

    return account;
  }

  async transaction() {
    return {
      start: () => this.queryRunner.startTransaction(),
      commit: () => this.queryRunner.commitTransaction(),
      rollback: () => this.queryRunner.rollbackTransaction(),
      release: () => this.queryRunner.release(),
      find: (id: string) =>
        this.queryRunner.manager.findOne(Account, { where: { id } }),
    };
  }

  async update(id: string, value: number) {
    const account = await this.findById(id);

    account.balance = account.balance + value;

    const balance = await this.queryRunner.manager.update( Account, { id: account.id }, { balance: account.balance });

    console.log("o balance", balance);

    return true;
  }
}
