import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { Marker } from "../interfaces/marker.interface";
import { SystemPlan } from "../enums/system-plan.enum";
import { AddressDTO } from "./address.dto";
import { MarkerDTO } from "./marker.dto";
import { Type } from "class-transformer";

export class CreateClinicDTO {
  @IsNotEmpty({ message: "Name is required." })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: "CNPJ is required." })
  @IsString()
  cnpj!: string;

  @IsEnum(SystemPlan, { message: "Please, insert a valid plan." })
  @IsNotEmpty()
  systemPlan!: SystemPlan;

  @IsNotEmpty({ message: "Phone is required." })
  @IsString()
  phone!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  address?: AddressDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => MarkerDTO)
  markers?: MarkerDTO[];

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
