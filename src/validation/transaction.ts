import { HttpError } from "../error/http";
import { Account } from "../types/interfaces";

const validateTransaction = (
  withdrawFromAccount: Account,
  depositToAccount: Account,
  value: number
): [boolean | null, HttpError | null] => {
  const verification = {
    balance: withdrawFromAccount.balance >= value,
    account: withdrawFromAccount.id !== depositToAccount.id,
    value0: value > 0,
  };

  try {
    if (!verification.balance || !verification.account)
      throw new HttpError(
        400,
        "Invalid transaction! Not enough balance or same account"
      );

    if (!verification.value0)
      throw new HttpError(400, "Value must be greather than 0!");
  } catch (error: any) {
    return [null, error];
  }

  return [true, null];
};

export default validateTransaction;
