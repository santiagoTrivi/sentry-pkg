import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log("exception", typeof exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BadRequestException) {
      const responseBody = exception.getResponse();
      const message =
        typeof responseBody === "string"
          ? responseBody
          : (responseBody as any).message;
      console.log("message", message);
      response.status(status).json({
        statusCode: status,
        message,
      });
      return;
    }

    let message: any;

    response.status(status).json({
      statusCode: status,
    });
  }
}
