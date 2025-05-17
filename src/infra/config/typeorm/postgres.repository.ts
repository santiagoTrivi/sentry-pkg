import { InjectRepository } from "@nestjs/typeorm";
import { SentryRepository } from "../../../domain/sentry.repository";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { PG_CONNECTION } from "./contant";
import { UserProps } from "../../../domain/user.interface";

export class PostgresRepository implements SentryRepository {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}
  async register(user: UserProps): Promise<void> {
    const res = await this.conn.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [user.email, user.password]
    );
    return res.rows;
  }
  async find(email: string): Promise<any | null> {
    const res = await this.conn.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.rows[0];
  }
}
