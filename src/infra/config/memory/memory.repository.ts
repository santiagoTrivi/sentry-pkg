import { UserRepository } from "../../../domain/user.repository";
import { UserProps } from "../../../domain/user.interface";
import { v6 as uuidv6 } from "uuid";

export class MemoryRepository implements UserRepository {
  private users: UserProps[] = [];
  async findById(id: string): Promise<UserProps | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    return user;
  }

  async find(email: string): Promise<UserProps | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;
    return user;
  }
  async register(user: Omit<UserProps, "id">): Promise<void> {
    const tosave = {
      id: uuidv6(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(tosave);
  }
}
