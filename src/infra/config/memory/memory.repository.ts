import { SentryRepository } from "../../../domain/sentry.repository";
import { UserProps } from "../../../domain/user.interface";

export class MemoryRepository implements SentryRepository {
  private users: UserProps[] = [];

  async find(email: string): Promise<any | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    return user;
  }
  async register(user: UserProps): Promise<void> {
    this.users.push(user);
  }
}
