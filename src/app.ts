import express from "express";
import { PORT } from "./settings";

async function run() {
  const app = express();
  const router = express.Router();

  await import("./express-loader").then((x) => x.default({ app }));

  app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
  });
  
  router.get("/", (req, res) => {
    res.send("1.0");
  });
}

run();
