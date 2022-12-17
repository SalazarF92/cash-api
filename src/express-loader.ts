import { Application, json } from "express";
import routes from "./htttp/routes";
import cors from "cors";

export default ({ app }: { app: Application }) => {
  app.use(json());

  app.use(cors());

  

  app.use(routes());
  
  app.use((err: any, req: any, res: any, next: any) => {
    if (err.toJSON) {
      return res.status(err.status || 500).json(err.toJSON());
    }
    res.status(err.status || 400).json({
      status: err.status,
      message: err.message,
    });
  });
};
