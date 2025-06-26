import { transports } from "winston";
import { SentryLogger } from "./logger.abstract";
import path from "path";
import fs from "fs";

export class loggerService extends SentryLogger {
  constructor() {
    super();
    this.handle();
  }

  handle(): void {
    if (!fs.existsSync(path.join(process.cwd(), "logs"))) {
      fs.mkdirSync(path.join(process.cwd(), "logs"));
    }
    const logFilePath = path.join(process.cwd(), "logs", "application.log");
    this.logger.add(new transports.File({ filename: logFilePath }));
  }
}
