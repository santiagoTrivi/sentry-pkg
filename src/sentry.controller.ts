import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./infra/dto";
import { SentryAuthGuard } from "./infra/guard";
import { SentryService } from "./sentry.service";
import { RsaAuthGuard } from "./infra/guard/rsa.guard";

@Controller("auth")
export class SentryController {
  constructor(private readonly sentryService: SentryService) {}

  @Post("signup")
  signup(@Body() CreateUserDto: CreateUserDto) {
    console.log("data from CreateUserDto", CreateUserDto);
    return this.sentryService.register(CreateUserDto);
  }
  @UseGuards(SentryAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.sentryService.signToken(req.user);
  }

  @Get("me")
  @UseGuards(RsaAuthGuard)
  async getauth(@Request() req) {
    return this.sentryService.getauth(req.user.id);
  }
}
