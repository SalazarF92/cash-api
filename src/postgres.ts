//create connection with database

import { DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, DB_HOST } from "./settings";
import { DataSource } from "typeorm";
import "reflect-metadata";


const connection = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname+"/entities/**/*.{ts,js}"],
  synchronize: true,
  logging: false,
});

setTimeout(() => {
  connection
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);
    })
    .catch((err) => {
      console.error(`Data Source initialization error`, err);
    });
}, 40000);

export default connection;
