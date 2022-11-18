import express from "express";
import { PORT } from "./settings";

async function run() {
  const app = express();

  await import("./express-loader").then((x) => x.default({ app }));

  app.listen(3000, () => {
    console.log(`Server is running in port ${3000}`);
  });
}

run()
