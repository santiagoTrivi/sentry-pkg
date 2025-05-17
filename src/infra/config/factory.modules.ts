import { DatabaseOptions } from "../../domain/sentryOptions";
import { MemoryModule } from "./memory/memory.module";
import { PostgresModule } from "./typeorm/Postgres.module";

export function databaseModule(databaseOptions?: DatabaseOptions) {
  if (databaseOptions) {
    return PostgresModule.forRoot(databaseOptions);
  }
  return MemoryModule;
}
