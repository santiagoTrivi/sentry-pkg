import { UserProps } from "./user.interface";

export abstract class UserRepository {
  abstract register(user: Omit<UserProps, "id">): Promise<void>;
  abstract find(email: string): Promise<UserProps | null>;
  abstract findById(id: string): Promise<UserProps | null>;
}
