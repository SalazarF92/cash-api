import { HttpError } from "@/error/http";
import { Account } from "@/interfaces/account";

const validation = (
  withdrawFromAccount: Account,
  depositToAccount: Account,
  value: number
) => {
  const verification = {
    balance: withdrawFromAccount.balance >= value,
    account: withdrawFromAccount.id !== depositToAccount.id,
    value0: value > 0,
  };

  if (!verification.balance || !verification.account)
    throw new HttpError(
      400,
      "Invalid transaction! Not enough balance or same account"
    );
    
  if (!verification.value0) throw new HttpError(400, "Value must be greather than 0!");

  return true;
};

export default validation;
