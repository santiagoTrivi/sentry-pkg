import { SentryRepository } from "../../../domain/sentry.repository";
import { User } from "../../../sentry.interfaces";

export class MemoryRepository implements SentryRepository {
  private users: User[] = [];

  async find(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    return user;
  }
  async register(user: User): Promise<void> {
    this.users.push(user);
  }
}
