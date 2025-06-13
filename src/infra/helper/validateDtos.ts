import { SentryError } from "../../domain/sentry.error";
import { CreateUserDto, LoginUserDto } from "../dto";

export const validateCreateUserDto = (createUserDto: CreateUserDto) => {
  if (
    !createUserDto.username ||
    !createUserDto.email ||
    !createUserDto.password
  ) {
    throw new SentryError("Missing required fields, validate your request");
  }
};
