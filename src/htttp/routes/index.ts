import { Router } from "express";
import user from "./user";
import transaction from "./transaction";
import Account from "./account";

export default function routes(): Router {
  const app = Router();
  user(app);
  transaction(app);
  Account(app)

  app.get("/", (req, res) => {
    res.send("1.0");
  });

  return app;
}
