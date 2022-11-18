import { DataSource, Repository } from "typeorm";
import AccountService from "./account";
import { Transaction } from "@/entities/transaction";
import { HttpError } from "@/error/http";
import validation from "@/validation/transaction";

export default class TransactionService {
  private accountService: AccountService;
  private transactionRepository: Repository<Transaction>;
  constructor(source: DataSource) {
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

    const { connect, start, rollback, commit, release } =
      await this.accountService.transaction();

    const transaction = await this.transactionRepository.save(
      this.transactionRepository.create({
        creditedAccount,
        debitedAccount,
        value,
      })
    );

    await connect()
    await start();

    try {

      validation(withdrawFromAccount, depositToAccount, value);

      await this.accountService.update(withdrawFromAccount.id, -value);
      await this.accountService.update(depositToAccount.id, value);

      await commit();

      return transaction;
    } catch (error) {
      await rollback();
      throw new HttpError(error.status, error.message);
    } finally {
      await release();
    }
  }
}

