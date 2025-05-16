import { DynamicModule, Module } from "@nestjs/common";
import { SentryService } from "./sentry.service";
import { JwtModule } from "@nestjs/jwt";
import { readFileSync } from "fs";
import { SentryController } from "./sentry.controller";
import { RsaStrategy } from "./strategy";

@Module({})
export class SentryModule {
  static forRoot(): DynamicModule {
    const providers = [SentryService, RsaStrategy];
    const controllers = [SentryController];
    return {
      imports: [
        JwtModule.register({
          privateKey: readFileSync("private.key", "utf8"),
          signOptions: {
            algorithm: "RS256",
          },
        }),
      ],
      providers,
      controllers,
      exports: providers,
      module: SentryModule,
    };
  }
}
