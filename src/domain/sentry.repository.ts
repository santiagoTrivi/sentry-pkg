import { UserProps } from "./user.interface";

export abstract class SentryRepository {
  abstract register(user: UserProps): Promise<void>;
  abstract find(email: string): Promise<UserProps | null>;
  abstract findById(id: string): Promise<UserProps | null>;
}
