export abstract class TransactionService {
  abstract create(
    creditedAccount: string,
    debitedAccount: string,
    value: number
  ): Promise<any>;

  abstract filterTransactionsByAccount(
    userId: string,
    query: any
  ): Promise<any>;
}
