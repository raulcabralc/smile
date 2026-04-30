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

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: "Name is required." })
  name!: string;

  @IsEmail({}, { message: "Invalid email format." })
  @IsNotEmpty({ message: "Email is required." })
  email!: string;

  @IsString()
  @MinLength(6, { message: "Password must have at least 6 characters." })
  password!: string;

  @IsEnum(UserRole, { message: "Invalid user role." })
  role!: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  cro?: string;
}
