import connection from "../../postgres";
import authMiddleware from "../../middlewares/authMiddleware";
import TransactionServiceDB from "../../infra/database/services/transaction";
import { Router } from "express";
import RabbitService from "@/infra/queue/queue";
import { Payload } from "@/application/types/interfaces";

const route = Router();
export default function Transaction(app: Router) {
  const transactionService = new TransactionServiceDB(connection);
  const queueService = new RabbitService();
  app.use("/transaction", route);

  route.post("/create", authMiddleware, async (req: any, res: any) => {
    const { creditedAccount, debitedAccount, value } = req.body;
    const user = await transactionService.create(creditedAccount, debitedAccount, value);

    res.status(200).json(user);
  });

  route.get('/list', authMiddleware, async (req: any, res: any) => {

    const userId = req.id;

    const list = await transactionService.filterTransactionsByAccount(userId, req.query);

    res.status(200).json(list);
  }	);

  route.get('/consume', async (req: any, res: any) => {
    const messages: any = []
    await queueService.consume('transaction', (msg: any) => {
      messages.push(JSON.parse(msg.content.toString()));
    });


    res.status(200).json(messages);
  })

  route.post('/queue', async (req: any, res: any) => {
    const { payload } = req.body;
    try {
      const transaction = await transactionService.postInQueue(payload as Payload);
      res.status(200).json(transaction);
      
    } catch (error: any) {
      res.status(error.status).json(error.messge);
    }

  })
}
