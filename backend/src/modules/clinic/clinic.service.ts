import { Injectable } from "@nestjs/common";
import { ClinicRepository } from "./clinic.repository";

@Injectable()
export class ClinicService {
  constructor(private readonly clinicRepository: ClinicRepository) {}

  async findAll() {
    return await this.clinicRepository.findAll();
  }

  async findById(id: string) {
    return await this.clinicRepository.findById(id);
  }
}
