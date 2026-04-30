import { Controller, Get, Param } from "@nestjs/common";
import { ClinicService } from "./clinic.service";
import { ClinicEntity } from "./clinic.entity";

@Controller("/clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  async findAll(): Promise<ClinicEntity[] | null> {
    return await this.clinicService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<ClinicEntity | null> {
    return await this.clinicService.findOne(id);
  }
}
