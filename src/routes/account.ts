import connection from "../db/postgres";
import authMiddleware from "../middlewares/authMiddleware";
import AccountService from "../services/account";
import UserService from "../services/user";
import { Router } from "express";

const route = Router();
export default function Account(app: Router) {
  const userService = new UserService(connection);
  const accountService = new AccountService(connection);
  app.use("/account", route);

  route.get("/list", authMiddleware, async (req: any, res) => {
    const user = await userService.findOneById(req.id);
    const accounts = await accountService.getAll(user.accountId);

    res.status(200).json(accounts);
  });
}
