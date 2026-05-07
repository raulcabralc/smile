import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDTO {
  @IsEmail({}, { message: "Please provide a valid email." })
  @IsNotEmpty()
  email!: string;

  @MinLength(6, { message: "Password must have at least 6 characters." })
  @IsNotEmpty()
  password!: string;
}
