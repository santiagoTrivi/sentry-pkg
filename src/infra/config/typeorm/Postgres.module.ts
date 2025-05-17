import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { Pool } from "pg";
import { PG_CONNECTION } from "./contant";
import { PostgresRepository } from "./postgres.repository";
import { DatabaseOptions } from "../../../domain/sentryOptions";
import { SentryRepository } from "../../../domain/sentry.repository";

@Module({})
export class PostgresModule implements OnModuleInit {
  private readonly logger = new Logger(PostgresModule.name);
  constructor(@Inject(PG_CONNECTION) private conn: any) {}
  async onModuleInit() {
    await this.conn.connect();
    this.logger.log("Connected to PostgreSQL database from Sentry");
    await this.conn.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await this.conn.query(
      `
      CREATE TABLE IF NOT EXISTS users 
      (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, createdAt TIMESTAMP DEFAULT NOW(), updatedAt TIMESTAMP DEFAULT NOW())
      `
    );
  }
  static forRoot(optionds: DatabaseOptions) {
    const dbProvider = {
      provide: PG_CONNECTION,
      useValue: new Pool({
        user: optionds.user,
        host: optionds.host,
        database: optionds.database,
        password: optionds.password,
        port: optionds.port,
      }),
    };
    const providers = [
      dbProvider,
      {
        provide: SentryRepository,
        useClass: PostgresRepository,
      },
    ];
    return {
      module: PostgresModule,
      providers,
      exports: providers,
    };
  }
}
