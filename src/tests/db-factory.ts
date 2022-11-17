import { DataType, newDb } from "pg-mem";
import { v4 } from "uuid";

export const setupDataSource = async (entities: any[]) => {
  const db = newDb();

  db.public.registerFunction({
    implementation: (x: any) => `test${x}`,
    name: "current_database",
    args: [],
    returns: DataType.text,
  });

  db.public.registerFunction({
    name: "version",
    implementation: () => "test",
  });

  db.registerExtension("uuid-ossp", (schema) => {
    schema.registerFunction({
      name: "uuid_generate_v4",
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });

  const source = await db.adapters.createTypeormDataSource({
    type: "postgres",
    entities,
  });

  await source.initialize();
  await source.synchronize();

  return source;
};
