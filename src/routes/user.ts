import connection from "@/db/postgres";
import UserService from "@/services/user";
import { Router } from "express";

const route = Router();
export default function User(app: Router) {
  const userService = new UserService(connection);
  app.use("/user", route);

  route.post("/create", async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.create({ username, password });

    res.status(200).json(user);
  });
}
