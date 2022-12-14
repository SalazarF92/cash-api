import express from "express";
import { rabbitConnection } from "./queue/rabbit";
import { PORT } from "./settings";

async function run() {
  const app = express();

  await rabbitConnection.initialize();
  await import("./express-loader").then((x) => x.default({ app }));

  app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
  });
}

run();
