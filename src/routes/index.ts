import { Router } from "express";
import user from "./user";
import transaction from "./transaction";

export default function routes(): Router {
  const app = Router();
  user(app);
  transaction(app);

  return app;
}
