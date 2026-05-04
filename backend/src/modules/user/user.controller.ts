import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./types/dtos/create-user.dto";

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

    return await this.userService.create(clinicId, createUserDTO);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string): Promise<UserEntity> {
    const clinicId = "demo-clinic-123";

    return await this.userService.delete(clinicId, id);
  }
}
