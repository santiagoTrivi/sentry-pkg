import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { LocalAuthGuard } from "./guard/local.guard";
import { SentryService } from "./sentry.service";

@Controller("auth")
export class SentryController {
  constructor(private readonly sentryService: SentryService) {}

  @Post("signup")
  signup(@Body() CreateUserDto: CreateUserDto) {
    return this.sentryService.register(CreateUserDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.sentryService.signToken(req.user);
  }
}
