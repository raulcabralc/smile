import { Module } from "@nestjs/common";
import { ClinicService } from "./clinic.service";
import { ClinicRepository } from "./clinic.repository";
import { DynamoDbProvider } from "../../common/providers/dynamodb.provider";
import { ClinicController } from "./clinic.controller";

@Module({
  providers: [ClinicService, ClinicRepository],
  controllers: [ClinicController],
  exports: [ClinicService],
})
export class ClinicModule {}
