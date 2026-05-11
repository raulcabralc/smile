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
  @IsNotEmpty({ message: "Name is required." })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Invalid email format." })
  email!: string;

  @IsNotEmpty({ message: "Password is required." })
  @IsString()
  @MinLength(6, { message: "Password must have at least 6 characters." })
  password!: string;

  @IsNotEmpty({ message: "Role is required." })
  @IsEnum(UserRole, { message: "Invalid user role." })
  role!: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  cro?: string;
}
