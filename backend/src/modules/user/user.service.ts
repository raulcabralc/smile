import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./types/dtos/create-user.dto";
import { ClinicService } from "../clinic/clinic.service";

@Injectable()
export class UserService {
  private readonly logger = new Logger();
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clinicService: ClinicService,
  ) {}

  async findAll(clinicId: string): Promise<UserEntity[]> {
    return await this.userRepository.findAll(clinicId);
  }

  async findOne(clinicId: string, id: string): Promise<UserEntity> {
    const result = await this.userRepository.findOne(clinicId, id);

    if (!result) {
      throw new NotFoundException("User not found.");
    }

    return result;
  }

  async create(
    clinicId: string,
    createUserDTO: CreateUserDTO,
  ): Promise<UserEntity> {
    const clinicExists = await this.clinicService.findOne(clinicId);
    const emailExists = await this.userRepository.findByEmail(
      clinicId,
      createUserDTO.email,
    );

    if (!clinicExists) {
      throw new NotFoundException(
        `The clinic with id ${clinicId} does not exist.`,
      );
    }

    if (emailExists)
      throw new ConflictException(
        `The email ${createUserDTO.email} is already registered.`,
      );
  }
}
