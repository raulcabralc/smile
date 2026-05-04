import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./types/dtos/create-user.dto";
import { ClinicService } from "../clinic/clinic.service";
import * as bcrypt from "bcrypt";
import { UserRole } from "./types/enums/roles.enum";

@Injectable()
export class UserService {
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

    if (!clinicExists) {
      throw new NotFoundException(
        `The clinic with id ${clinicId} does not exist.`,
      );
    }

    const emailExists = await this.userRepository.findByEmail(
      clinicId,
      createUserDTO.email,
    );

    if (emailExists)
      throw new ConflictException(
        `The email ${createUserDTO.email} is already registered.`,
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);

    const newUser = new UserEntity({
      ...createUserDTO,
      id: crypto.randomUUID(),
      clinicId: clinicId,
      password: hashedPassword,
      isActive: createUserDTO.isActive ?? true,
    });

    return await this.userRepository.create(newUser);
  }

  async delete(clinicId: string, id: string): Promise<UserEntity> {
    const userExists = await this.userRepository.findOne(clinicId, id);

    if (!userExists) throw new NotFoundException("User not found.");

    const result = await this.userRepository.delete(clinicId, id);

    if (!result)
      throw new ServiceUnavailableException(
        "Unexpected database error. Please, try again.",
      );

    return new UserEntity(userExists);
  }
}
