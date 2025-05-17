// auth.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "./infra/dto/create.user.dto";
import { LoginUserDto } from "./infra/dto/login.user.dto";
import * as bcrypt from "bcrypt";
import { User } from "./sentry.interfaces";
import { SentryRepository } from "./domain/sentry.repository";

@Injectable()
export class SentryService {
  constructor(
    private jwtService: JwtService,
    private readonly repo: SentryRepository
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const existingUser = await this.repo.find(createUserDto.email);

    if (existingUser) throw new BadRequestException("User already exists");

    const newUser = { ...createUserDto, password: hashedPassword };

    await this.repo.register(newUser);

    return { message: "User registered successfully" };
  }

  async login(loginUserDto: LoginUserDto) {
    console.log("data from loginUserDto", loginUserDto);
    const user = await this.repo.find(loginUserDto.email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) return null;

    return user;
  }

  signToken(user: User) {
    const payload = { username: user.username, sub: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
