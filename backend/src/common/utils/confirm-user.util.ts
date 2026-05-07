import { Request } from "express";
import { UserPayload } from "../../modules/auth/types/interfaces/user-payload.interface";
import { UnauthorizedException } from "@nestjs/common";

export function confirmUser(req: Request) {
  const user = req.user;

  if (!user) throw new UnauthorizedException("User not logged in.");

  return user as UserPayload;
}
