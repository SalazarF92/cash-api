import connection from "../postgres";
import authMiddleware from "../middlewares/authMiddleware";
import UserServiceDB from "../infra/database/services/user";
import { Router } from "express";

const route = Router();
export default function User(app: Router) {
  const userService = new UserServiceDB(connection);
  app.use("/user", route);

  route.post("/create", async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.create({ username, password });

    res.status(200).json(user);
  });

  route.post("/login", async (req: any, res: any) => {
    const { username, password } = req.body;

    const sessionToken = await userService.login({username, password});

    res.status(200).json(sessionToken);
  });

  route.get("/me", authMiddleware, async (req: any, res: any) => {
    const myData = await userService.findOneById(req.id, false);

    res.status(200).json(myData);
  });
}
