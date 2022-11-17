import { DataSource, Repository } from "typeorm";
import AccountService from "./account";
import { Transaction } from "@/entities/transaction";
import { HttpError } from "@/error/http";

export default class TransactionService {
  private accountService: AccountService;
  private transactionRepository: Repository<Transaction>;
  constructor(source: DataSource) {
    this.accountService = new AccountService(source);
    this.transactionRepository = source.getRepository(Transaction);
  }

  async create(
    { creditedAccount, debitedAccount }: Partial<Transaction>,
    value: number
  ) {
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

    const { start, rollback, commit, release } =
      await this.accountService.transaction();

    await this.transactionRepository.save(
      this.transactionRepository.create({
        creditedAccount,
        debitedAccount,
        value,
      })
    );

    await start();

    try {
      await this.accountService.update(withdrawFromAccount.id, -value);
      await this.accountService.update(depositToAccount.id, value);

      await commit();

      const transaction = await this.transactionRepository.findOne({
        where: {
          creditedAccount,
          debitedAccount,
        },
      });

      return transaction;
    } catch (error) {
      await rollback();
      const test = await this.accountService.findById(debitedAccount);
      console.log("afterRollback", test);
      throw new HttpError(500, "Transaction failed");
    } finally {
      await release();
    }
  }
}
