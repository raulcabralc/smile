import { Injectable } from "@nestjs/common";
import { ClinicRepository } from "./clinic.repository";
import { ClinicEntity } from "./clinic.entity";

@Injectable()
export class ClinicService {
  constructor(private readonly clinicRepository: ClinicRepository) {}

  async findAll(): Promise<ClinicEntity[] | null> {
    return await this.clinicRepository.findAll();
  }

  async findOne(id: string): Promise<ClinicEntity | null> {
    return await this.clinicRepository.findOne(id);
  }
}
