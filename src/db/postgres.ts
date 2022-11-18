//create connection with database

import { DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "@/settings";
import { DataSource } from "typeorm";

const connection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ["src/entities/**/*.{ts,js}"],
  synchronize: true,
  logging: false,
});

connection
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });

export default connection;
