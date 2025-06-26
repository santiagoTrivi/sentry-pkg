import { transports, format } from "winston";
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
import path from "path";

export const loggerConfig = format.combine(
  format.timestamp(),
  format.ms(),
  nestWinstonModuleUtilities.format.nestLike("sentry", {
    colors: true,
    prettyPrint: true,
  })
);
