import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./infra/dto";
import { RefreshAuthGuard, SentryAuthGuard } from "./infra/guard";
import { SentryService } from "./sentry.service";
import { RsaAuthGuard } from "./infra/guard/rsa.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class SentryController {
  constructor(
    private readonly sentryService: SentryService,
    private readonly authService: AuthService
  ) {}

  @Post("signup")
  signup(@Body() CreateUserDto: CreateUserDto) {
    console.log("data from CreateUserDto", CreateUserDto);
    return this.sentryService.register(CreateUserDto);
  }
  @UseGuards(SentryAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.authService.signToken(req.user);
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  async refreshTokens(@Request() req) {
    const [id, refreshToken] = [req.user.id, req.user.refreshToken];
    return await this.authService.refreshTokens(id, refreshToken);
  }

  @Get("me")
  @UseGuards(RsaAuthGuard)
  async getauth(@Request() req) {
    return this.sentryService.getauth(req.user.id);
  }
}
