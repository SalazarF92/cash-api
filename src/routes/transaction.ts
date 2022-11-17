import connection from "@/db/postgres";
import UserService from "@/services/user";
import { Router } from "express";

const route = Router();
export default function Transaction(app: Router) {
  const userService = new UserService(connection);
  app.use("/transaction", route);

  route.post("/create", async (req, res) => {
    const { creditedAccount, debitedAccount } = req.body;

    // const user = await userService.create({ creditedAccount, debitedAccount });

    // res.status(200).json(user);
  });
}
