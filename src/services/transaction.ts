import { DataSource, Repository } from "typeorm";
import AccountService from "./account";
import { Transaction } from "@/entities/transaction.entity";
import { HttpError } from "@/error/http";
import validation from "@/validation/transaction";
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
      await this.accountService.update(depositToAccount.id, value);

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

  async filterTransactionsByAccount(userId: string, type: 'creditedAccount' | 'debitedAccount') {

    const user = await this.userService.findOneById(userId);

    const transactions = await this.transactionRepository.find({
      where: { [type]: user.accountId },
    });

    return transactions;
  }
}
