import { Module } from "@nestjs/common";
import { UserRepository } from "../../../domain/user.repository";
import { MemoryRepository } from "./memory.repository";
import { AuthRepository } from "../../../domain/auth.repository";
import { AuthMemoryRepository } from "./auth.memory.repository";

const providers = [
  {
    provide: UserRepository,
    useClass: MemoryRepository,
  },
  {
    provide: AuthRepository,
    useClass: AuthMemoryRepository,
  },
];

@Module({
  imports: [],
  providers,
  exports: providers,
})
export class MemoryModule {}
