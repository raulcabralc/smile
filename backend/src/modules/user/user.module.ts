import { forwardRef, Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ClinicModule } from "../clinic/clinic.module";

@Module({
  imports: [forwardRef(() => ClinicModule)],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
