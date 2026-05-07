import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { UserPayload } from "./types/interfaces/user-payload.interface";
import { LoginDTO } from "./types/dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import type { Request } from "express";
import { confirmUser } from "../../common/utils/confirm-user.util";

@Controller("/auth")
export class AuthController {
  private logger = new Logger();

  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() loginDto: LoginDTO) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) throw new UnauthorizedException("Invalid credentials.");

    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async me(@Req() req: Request) {
    const user = confirmUser(req);

    this.logger.log(user);

    return await this.authService.me(user);
  }
}
