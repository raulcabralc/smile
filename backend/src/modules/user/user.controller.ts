import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./types/dtos/create-user.dto";
import { UpdateUserDTO } from "./types/dtos/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { confirmUser } from "../../common/utils/confirm-user.util";
import type { Request } from "express";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async findAll(@Req() req: Request): Promise<UserEntity[]> {
    const user = confirmUser(req);

    return await this.userService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async findOne(
    @Req() req: Request,
    @Param("id") id: string,
  ): Promise<UserEntity> {
    const user = confirmUser(req);

    return await this.userService.findOne(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  async create(
    @Req() req: Request,
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserEntity> {
    const user = confirmUser(req);

    return await this.userService.create(user, createUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/update/:id")
  async update(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = confirmUser(req);

    return await this.userService.update(user, id, updateUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async delete(
    @Req() req: Request,
    @Param("id") id: string,
  ): Promise<UserEntity> {
    const user = confirmUser(req);

    return await this.userService.delete(user, id);
  }
}
