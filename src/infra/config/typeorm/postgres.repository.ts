import { UserRepository } from "../../../domain/user.repository";
import { Inject } from "@nestjs/common";
import { PG_CONNECTION } from "./contant";
import { UserProps } from "../../../domain/user.interface";

export class PostgresRepository implements UserRepository {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}
  async findById(id: string): Promise<UserProps | null> {
    const res = await this.conn.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (res.rows.length === 0) return null;

    return res.rows[0];
  }
  async register(user: Omit<UserProps, "id">): Promise<void> {
    const res = await this.conn.query(
      "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
      [user.email, user.password, user.username]
    );
    return res.rows;
  }
  async find(email: string): Promise<UserProps | null> {
    const res = await this.conn.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.rows[0];
  }
}
