import { IsNotEmpty, ValidateNested } from "class-validator";
import { CreateClinicDTO } from "./create-clinic.dto";
import { CreateUserDTO } from "../../../user/types/dtos/create-user.dto";
import { Type } from "class-transformer";

export class SetupDTO {
  @IsNotEmpty({ message: "Clinic is required." })
  @ValidateNested()
  @Type(() => CreateClinicDTO)
  clinic!: CreateClinicDTO;

  @IsNotEmpty({ message: "User is required." })
  @ValidateNested()
  @Type(() => CreateUserDTO)
  user!: CreateUserDTO;
}
