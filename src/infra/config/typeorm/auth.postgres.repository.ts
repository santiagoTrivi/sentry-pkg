import { Inject, Injectable } from "@nestjs/common";
import { AuthRepository } from "../../../domain/auth.repository";
import { AuthProps } from "../../../domain/auth.interface";
import { PG_CONNECTION } from "./contant";

@Injectable()
export class PostgresAuthRepository implements AuthRepository {
  constructor(@Inject(PG_CONNECTION) private conn: any) {}

  async create(auth: AuthProps): Promise<void> {
    await this.conn.query(
      `INSERT INTO auth_token ("userId", "refreshToken") VALUES ($1, $2)`,
      [auth.userId, auth.refreshToken]
    );
  }
  async update(userId: string, refreshToken: string): Promise<void> {
    const auth = await this.find(userId);
    if (!auth)
      return this.create({
        userId,
        refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    await this.conn.query(
      `UPDATE auth_token SET "refreshToken" = $1 WHERE "userId" = $2`,
      [refreshToken, userId]
    );
  }
  async find(userId: string): Promise<AuthProps | null> {
    const res = await this.conn.query(
      `SELECT * FROM auth_token WHERE "userId" = $1`,
      [userId]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  }
}
