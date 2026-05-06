import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./types/dtos/create-user.dto";
import { UpdateUserDTO } from "./types/dtos/update-user.dto";
import { UserRole } from "./types/enums/roles.enum";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  async findAll(): Promise<UserEntity[]> {
    const clinicId = "demo-clinic-123";

    return await this.userService.findAll(clinicId);
  }

  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<UserEntity> {
    const clinicId = "demo-clinic-123";

    return await this.userService.findOne(clinicId, id);
  }

  @Post("/create")
  async create(@Body() createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const clinicId = "demo-clinic-123";
    const user = {
      id: "0000-0000-0000-0000",
      role: UserRole.ADMIN,
      email: "admin@smile.com",
    };

    return await this.userService.create(user, clinicId, createUserDTO);
  }

  @Put("/update/:id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    const clinicId = "demo-clinic-123";
    const user = {
      id: "0000-0000-0000-0000",
      role: UserRole.ADMIN,
      email: "admin@smile.com",
    };

    return await this.userService.update(user, clinicId, id, updateUserDTO);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string): Promise<UserEntity> {
    const clinicId = "demo-clinic-123";

    return await this.userService.delete(clinicId, id);
  }
}
