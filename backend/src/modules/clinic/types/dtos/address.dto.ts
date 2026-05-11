import { IsOptional, IsString } from "class-validator";

export class AddressDTO {
  @IsString()
  cep!: string;

  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsString()
  neighborhood!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsOptional()
  @IsString()
  complement?: string;
}
