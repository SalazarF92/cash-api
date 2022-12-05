//create connection with database

import { PGDATABASE, PGPASSWORD, PGPORT, PGUSER, PGHOST } from "./settings";
import { DataSource } from "typeorm";
import "reflect-metadata";


const connection = new DataSource({
  type: "postgres",
  host: PGHOST,
  port: PGPORT,
  username: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  entities: ["./build/entities/**/*.{ts,js}"],
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
