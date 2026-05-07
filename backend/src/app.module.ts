import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./common/database/database.module";
import { ClinicModule } from "./modules/clinic/clinic.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),

    DatabaseModule,
    ClinicModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
