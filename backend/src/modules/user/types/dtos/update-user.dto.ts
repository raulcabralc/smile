import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../enums/roles.enum";

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format." })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: "Password must have at least 6 characters." })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "Invalid user role." })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  cro?: string;
}
