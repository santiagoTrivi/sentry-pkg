import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { Pool } from "pg";
import { PG_CONNECTION } from "./contant";
import { PostgresRepository } from "./postgres.repository";
import { DatabaseOptions } from "../../../domain/sentryOptions";
import { UserRepository } from "../../../domain/user.repository";
import { AuthRepository } from "../../../domain/auth.repository";
import { PostgresAuthRepository } from "./auth.postgres.repository";

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
      (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), email VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW())
      `
    );
    await this.conn.query(
      `
      CREATE TABLE IF NOT EXISTS auth_token 
      (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "userId" UUID NOT NULL, "refreshToken" TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE)
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
        provide: UserRepository,
        useClass: PostgresRepository,
      },
      {
        provide: AuthRepository,
        useClass: PostgresAuthRepository,
      },
    ];
    return {
      module: PostgresModule,
      providers,
      exports: providers,
    };
  }
}
