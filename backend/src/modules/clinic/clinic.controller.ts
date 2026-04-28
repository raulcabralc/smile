import { Controller, Get, Param } from "@nestjs/common";
import { ClinicService } from "./clinic.service";

@Controller("/clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  async findAll() {
    return await this.clinicService.findAll();
  }

  @Get("/:id")
  async findById(@Param("id") id: string) {
    return await this.clinicService.findById(id);
  }
}
