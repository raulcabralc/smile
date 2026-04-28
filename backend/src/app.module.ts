import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./common/database/database.module";
import { ClinicModule } from "./modules/clinic/clinic.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),

    DatabaseModule,
    ClinicModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
