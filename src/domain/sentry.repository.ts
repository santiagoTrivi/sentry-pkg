import { User } from "../sentry.interfaces";

export abstract class SentryRepository {
  abstract register(user: User): Promise<void>;
  abstract find(email: string): Promise<User | null>;
}
