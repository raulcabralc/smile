import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ClinicService } from "./clinic.service";
import { ClinicEntity } from "./clinic.entity";
import { SetupDTO } from "./types/dtos/setup.dto";

@Controller("/clinic")
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  async findAll(): Promise<ClinicEntity[] | null> {
    return await this.clinicService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<ClinicEntity> {
    return await this.clinicService.findOne(id);
  }

  @Post("/create")
  async create(@Body() setupDto: SetupDTO) {
    return await this.clinicService.create(setupDto);
  }
}
