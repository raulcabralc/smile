import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserPayload } from "./types/interfaces/user-payload.interface";

@Injectable()
export class AuthService {
  private logger = new Logger();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailWithPassword(email);

    if (user.password && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserPayload) {
    const payload = {
      id: user.id,
      clinicId: user.clinicId,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async me(user: UserPayload) {
    this.logger.log({ clinicId: user.clinicId, id: user.id });

    return await this.userService.findOne(user.clinicId, user.id);
  }
}
