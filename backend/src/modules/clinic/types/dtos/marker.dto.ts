import { IsHexColor, IsNotEmpty, IsString } from "class-validator";

export class MarkerDTO {
  @IsString()
  @IsNotEmpty({ message: "Title is required." })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: "Color is required." })
  @IsHexColor({ message: "Color should be a HEX code." })
  color!: string;
}
