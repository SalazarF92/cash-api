import connection from "@/db/postgres";
import authMiddleware from "@/middlewares/authMiddleware";
import TransactionService from "@/services/transaction";
import { Router } from "express";

const route = Router();
export default function Transaction(app: Router) {
  const transactionService = new TransactionService(connection);
  app.use("/transaction", route);

  route.post("/create", authMiddleware, async (req, res) => {
    const { creditedAccount, debitedAccount, value } = req.body;
    const user = await transactionService.create(creditedAccount, debitedAccount, value);

    res.status(200).json(user);
  });
}
