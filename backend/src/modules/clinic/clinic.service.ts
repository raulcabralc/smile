import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ClinicRepository } from "./clinic.repository";
import { ClinicEntity } from "./clinic.entity";
import { SetupDTO } from "./types/dtos/setup.dto";
import { UserPayload } from "../auth/types/interfaces/user-payload.interface";
import { UserRepository } from "../user/user.repository";
import { UserEntity } from "../user/user.entity";
import * as bcrypt from "bcrypt";
import { UserRole } from "../user/types/enums/roles.enum";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class ClinicService {
  constructor(
    private readonly clinicRepository: ClinicRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<ClinicEntity[]> {
    try {
      return await this.clinicRepository.findAll();
    } catch {
      throw new ServiceUnavailableException(
        "An unexpected error occured. Please, try again.",
      );
    }
  }

  async findOne(id: string): Promise<ClinicEntity> {
    const result = await this.clinicRepository.findOne(id);

    if (!result) throw new NotFoundException("Clinic not found.");

    return result;
  }

  async create(
    setupDto: SetupDTO,
  ): Promise<{ clinic: ClinicEntity; user: UserEntity }> {
    const clinicPlain = instanceToPlain(setupDto.clinic);
    const userPlain = instanceToPlain(setupDto.user);

    const emailExists = await this.userRepository.findByEmail(userPlain.email);

    if (emailExists)
      throw new ConflictException(
        `The email ${userPlain.email} is already registered.`,
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPlain.password, salt);

    const newClinicId = crypto.randomUUID();
    const newUserId = crypto.randomUUID();

    const newUser = new UserEntity({
      ...userPlain,
      id: newUserId,
      clinicId: newClinicId,
      password: hashedPassword,
      isActive: true,
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString(),
    });

    try {
      await this.userRepository.create(newUser);
    } catch {
      throw new ServiceUnavailableException(
        "An unexpected error occured. Please, try again.",
      );
    }

    //

    const newClinic = new ClinicEntity({
      ...clinicPlain,
      id: newClinicId,
      ownerId: newUserId,
      createdAt: new Date().toISOString(),
    });

    try {
      await this.clinicRepository.create(newClinic);
    } catch {
      throw new ServiceUnavailableException(
        "An unexpected error occured. Please, try again.",
      );
    }

    return {
      clinic: newClinic,
      user: newUser,
    };
  }
}
