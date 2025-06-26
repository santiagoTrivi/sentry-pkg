// auth.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./infra/dto/create.user.dto";
import * as bcrypt from "bcrypt";
import { UserRepository } from "./domain/user.repository";
import { validateCreateUserDto } from "./infra/helper/validateDtos";
import { SentryError } from "./domain/sentry.error";
import { SentryLogger } from "./config/logger/logger.abstract";

@Injectable()
export class SentryService {
  constructor(
    private readonly repo: UserRepository,
    private readonly logger: SentryLogger
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      validateCreateUserDto(createUserDto);

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const existingUser = await this.repo.find(createUserDto.email);

      if (existingUser) throw new BadRequestException("User already exists");

      const newUser = { ...createUserDto, password: hashedPassword };

      await this.repo.register(newUser);

      return { message: "User registered successfully" };
    } catch (error) {
      if (
        error instanceof SentryError ||
        error instanceof BadRequestException
      ) {
        this.logger.error(error.message);
        throw new BadRequestException(error.message);
      }
      this.logger.error("unexpected error");
      throw error;
    }
  }

  async getauth(id: string) {
    const user = await this.repo.findById(id);

    if (!user) {
      this.logger.error("User not found");
      throw new BadRequestException("User not found");
    }

    const { password, ...rest } = user;

    return rest;
  }
}
