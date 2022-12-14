import connection from "../postgres";
import authMiddleware from "../middlewares/authMiddleware";
import TransactionService from "../services/transaction";
import { Router } from "express";
import QueueService from "@/services/queue";

const route = Router();
export default function Transaction(app: Router) {
  const transactionService = new TransactionService(connection);
  const queueService = new QueueService();
  app.use("/transaction", route);

  route.post("/create", authMiddleware, async (req, res) => {
    const { creditedAccount, debitedAccount, value } = req.body;
    const user = await transactionService.create(creditedAccount, debitedAccount, value);

    res.status(200).json(user);
  });

  route.get('/list', authMiddleware, async (req: any, res) => {

    const userId = req.id;

    const list = await transactionService.filterTransactionsByAccount(userId, req.query);

    res.status(200).json(list);
  }	);

  route.get('/consume', async (req, res) => {
    const messages = []
    await queueService.consume('transaction', (msg) => {
      messages.push(msg.content.toString());
    });


    res.status(200).json(messages);
  })

  route.post('/queue', async (req, res) => {
    const { message } = req.body;
    
    const queue = await queueService.publishInQueue('transaction', message);
    await queueService.publishInExchange('ngcash', 'transaction', message);

    res.status(200).json(queue);
  })
}
