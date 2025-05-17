// auth.service.ts
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "./infra/dto/create.user.dto";
import { LoginUserDto } from "./infra/dto/login.user.dto";
import * as bcrypt from "bcrypt";
import { User } from "./sentry.interfaces";

@Injectable()
export class SentryService {
  private users: User[] = [];

  constructor(private jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = { ...createUserDto, password: hashedPassword };
    this.users.push(newUser);
    return { message: "User registered successfully" };
  }

  async login(loginUserDto: LoginUserDto) {
    console.log("data from loginUserDto", loginUserDto);
    const user = this.users.find((u) => u.username === loginUserDto.email);
    console.log(user);
    console.log(this.users);

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
