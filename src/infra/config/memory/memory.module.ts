import { Module } from "@nestjs/common";
import { SentryRepository } from "../../../domain/sentry.repository";
import { MemoryRepository } from "./memory.repository";

@Module({
  imports: [],
  providers: [
    {
      provide: SentryRepository,
      useClass: MemoryRepository,
    },
  ],
  exports: [
    {
      provide: SentryRepository,
      useClass: MemoryRepository,
    },
  ],
})
export class MemoryModule {}
