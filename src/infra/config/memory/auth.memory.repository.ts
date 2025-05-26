import { AuthProps } from "../../../domain/auth.interface";
import { AuthRepository } from "../../../domain/auth.repository";
import { v6 as uuidv6 } from "uuid";

export class AuthMemoryRepository implements AuthRepository {
  private auths: AuthProps[] = [];

  async create(auth: AuthProps): Promise<void> {
    const tosave: AuthProps = {
      id: uuidv6(),
      ...auth,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.auths.push(tosave);
  }
  async update(userId: string, refreshToken: string): Promise<void> {
    const auth = this.auths.find((a) => a.userId === userId);

    if (auth) {
      auth.refreshToken = refreshToken;
      auth.updatedAt = new Date();

      const index = this.auths.indexOf(auth);
      this.auths[index] = auth;
    } else {
      const tosave: AuthProps = {
        id: uuidv6(),
        userId,
        refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.auths.push(tosave);
    }
  }
  async find(userId: string): Promise<AuthProps | null> {
    const auth = this.auths.find((a) => a.userId === userId);
    if (!auth) return null;
    return auth;
  }
}
