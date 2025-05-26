import { AuthProps } from "./auth.interface";

export abstract class AuthRepository {
  abstract create(auth: AuthProps): Promise<void>;
  abstract update(userId: string, refreshToken: string): Promise<void>;
  abstract find(userId: string): Promise<AuthProps | null>;
}
