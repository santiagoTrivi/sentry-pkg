import { DynamicModule, Module } from "@nestjs/common";
import { SentryService } from "./sentry.service";
import { JwtModule } from "@nestjs/jwt";
import { readFileSync } from "fs";
import { SentryController } from "./sentry.controller";
import { RsaStrategy, LocalStrategy } from "./infra/strategy";
import { SentryOptions } from "./domain/sentryOptions";
import { databaseModule } from "./infra/config/factory.modules";
import { AuthService } from "./auth.service";
import { RefreshTokenStrategy } from "./infra/strategy/refresh.token.strategy";
import { SentryLogger } from "./config/logger/logger.abstract";
import { loggerService } from "./config/logger/logger.service";

@Module({})
export class SentryModule {
  static forRoot(options?: SentryOptions): DynamicModule {
    const providers = [
      RsaStrategy,
      LocalStrategy,
      RefreshTokenStrategy,
      SentryService,
      AuthService,
      {
        provide: SentryLogger,
        useClass: loggerService,
      },
    ];
    const controllers = [SentryController];
    return {
      imports: [
        JwtModule.register({
          privateKey: readFileSync("private.key", "utf8"),
          signOptions: {
            algorithm: "RS256",
            expiresIn: options?.expiresIn || "1m",
          },
        }),
        databaseModule(options?.databaseOptions),
      ],
      providers,
      controllers,
      exports: providers,
      module: SentryModule,
    };
  }
}
