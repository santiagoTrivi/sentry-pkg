import { SentryRepository } from "../../../domain/sentry.repository";
import { UserProps } from "../../../domain/user.interface";
import { v6 as uuidv6 } from "uuid";

export class MemoryRepository implements SentryRepository {
  async findById(id: string): Promise<UserProps | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    return user;
  }
  private users: UserProps[] = [];

  async find(email: string): Promise<UserProps | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    return user;
  }
  async register(user: UserProps): Promise<void> {
    const tosave = {
      id: uuidv6(),
      ...user,
      createdat: new Date(),
      updatedat: new Date(),
    };
    this.users.push(tosave);
  }
}
