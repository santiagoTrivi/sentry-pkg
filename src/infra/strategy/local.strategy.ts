import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SentryService } from "../../sentry.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly sentryService: SentryService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    console.log("Validating user:", email, password);
    const user = await this.sentryService.login({ email, password });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    return user;
  }
}
