import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./domain/user.repository";
import { AuthRepository } from "./domain/auth.repository";
import { LoginUserDto } from "./infra/dto/login.user.dto";
import * as bcrypt from "bcrypt";
import { UserProps } from "./domain/user.interface";
import { readFileSync } from "fs";
import { SentryLogger } from "./config/logger/logger.abstract";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly repo: UserRepository,
    private readonly authRepo: AuthRepository,
    private readonly logger: SentryLogger
  ) {}

  async login(loginUserDto: LoginUserDto) {
    if (!loginUserDto.email || !loginUserDto.password) return null;

    const user = await this.repo.find(loginUserDto.email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) return null;

    return user;
  }
  async signToken(user: UserProps) {
    const payload = { username: user.username, id: user.id };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, {
        privateKey: readFileSync("private.key", "utf8"),
        algorithm: "RS256",
        expiresIn: "7d",
      }),
    ]);

    await this.authRepo.update(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(userId: string, refreshTokeninput: string) {
    const auth = await this.authRepo.find(userId);
    const user = await this.repo.findById(userId);

    try {
      if (!user) throw new BadRequestException("User not found");
      if (!auth || !auth.refreshToken)
        throw new BadRequestException("Invalid refresh token");

      const { refreshToken } = auth;

      if (refreshToken !== refreshTokeninput)
        throw new BadRequestException("Invalid refresh token");

      const tokens = await this.signToken(user);

      await this.authRepo.update(userId, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.error(error.message);
        throw new BadRequestException(error.message);
      }
      this.logger.error("unexpected error");
      throw error;
    }
  }
}
