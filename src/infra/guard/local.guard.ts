import { AuthGuard } from "@nestjs/passport";

export class SentryAuthGuard extends AuthGuard("local") {
  constructor() {
    super();
  }
}
