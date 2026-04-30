import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ClinicModule } from "../clinic/clinic.module";

@Module({
  imports: [ClinicModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
