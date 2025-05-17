import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { readFileSync } from "fs";

@Injectable()
export class RsaStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync("public.key", "utf8"),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
