// auth.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "./infra/dto/create.user.dto";
import { LoginUserDto } from "./infra/dto/login.user.dto";
import * as bcrypt from "bcrypt";
import { UserRepository } from "./domain/user.repository";

@Injectable()
export class SentryService {
  constructor(
    private jwtService: JwtService,
    private readonly repo: UserRepository
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const existingUser = await this.repo.find(createUserDto.email);

    if (existingUser) throw new BadRequestException("User already exists");

    const newUser = { ...createUserDto, password: hashedPassword };

    await this.repo.register(newUser);

    return { message: "User registered successfully" };
  }

  async getauth(id: string) {
    const user = await this.repo.findById(id);

    if (!user) throw new BadRequestException("User not found");

    const { password, ...rest } = user;

    return rest;
  }
}
