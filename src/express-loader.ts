import "express-async-errors";
import { Application, json } from "express";
import routes from "./routes";
import cors from "cors";

export default ({ app }: { app: Application }) => {
  app.use(json());

  app.use(cors());

  app.use(routes());
  
  app.use((err, req, res, next) => {
    res.status(err.status || 400).json({
      status: err.status,
      message: err.message,
    });
  });
};
