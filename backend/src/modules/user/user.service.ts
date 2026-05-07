import {
  ConflictException,
  ForbiddenException,
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
import { UpdateUserDTO } from "./types/dtos/update-user.dto";
import { UserRole } from "./types/enums/roles.enum";

@Injectable()
export class UserService {
  private logger = new Logger();

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
    user: { id: string; role: UserRole; email: string },
    clinicId: string,
    createUserDTO: CreateUserDTO,
  ): Promise<UserEntity> {
    const clinicExists = await this.clinicService.findOne(clinicId);

    if (!clinicExists) {
      throw new NotFoundException(
        `The clinic with id ${clinicId} does not exist.`,
      );
    }

    if (user.id !== clinicExists.ownerId) {
      if (createUserDTO.role === UserRole.ADMIN) {
        throw new ForbiddenException("Cannot create an ADMIN user.");
      }
    }

    const emailExists = await this.userRepository.findByEmail(
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

  async update(
    user: { id: string; role: UserRole; email: string },
    clinicId: string,
    id: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    if (user.id === id && updateUserDTO.role) {
      throw new ForbiddenException("Cannot update your own role.");
    }

    const clinicExists = await this.clinicService.findOne(clinicId);

    if (!clinicExists) {
      throw new NotFoundException(
        `The clinic with id ${clinicId} does not exist.`,
      );
    }

    const userExists = await this.userRepository.findOne(clinicId, id);

    if (!userExists) throw new NotFoundException("User not found.");

    if (user.id !== clinicExists.ownerId) {
      if (updateUserDTO.role) {
        if (userExists.role === UserRole.ADMIN) {
          throw new ForbiddenException("Cannot change an ADMIN's role.");
        }

        if (updateUserDTO.role === UserRole.ADMIN) {
          throw new ForbiddenException("Cannot update a role to ADMIN.");
        }
      }
    }

    if (updateUserDTO.email) {
      const emailExists = await this.userRepository.findByEmail(
        updateUserDTO.email,
      );

      if (emailExists)
        throw new ConflictException(
          `The email ${updateUserDTO.email} is already registered.`,
        );
    }

    let hashedPassword = userExists.password;

    if (updateUserDTO.password) {
      const salt = await bcrypt.genSalt(10);

      hashedPassword = await bcrypt.hash(updateUserDTO.password, salt);
    }

    const updatedUser = new UserEntity({
      id: userExists.id,
      clinicId,
      name: updateUserDTO.name || userExists.name,
      email: updateUserDTO.email || userExists.email,
      password: hashedPassword,
      role: updateUserDTO.role || userExists.role,
      isActive: updateUserDTO.isActive ?? userExists.isActive,
      cro: updateUserDTO.cro || userExists.cro,
      createdAt: userExists.createdAt,
      updatedAt: new Date().toISOString(),
      ...updateUserDTO,
    });

    return await this.userRepository.update(updatedUser);
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

  ///

  async findByEmailWithPassword(email: string): Promise<UserEntity> {
    const result = await this.userRepository.findByEmailWithPassword(email);

    this.logger.log(result);

    if (!result) throw new NotFoundException("User not found.");

    return result;
  }
}
