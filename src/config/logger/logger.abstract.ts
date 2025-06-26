import winston, { Logger, transports } from "winston";
import { loggerConfig } from "./logger.config";

export abstract class SentryLogger {
  readonly logger: Logger;

  constructor() {
    this.logger = winston.createLogger(
      new transports.Console({ format: loggerConfig })
    );
  }

  abstract handle(): void;

  log(message: string): void {
    this.logger.log("info", message);
  }
  error(message: string): void {
    this.logger.log("error", message);
  }
}
