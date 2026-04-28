import { Global, Module } from "@nestjs/common";
import { DynamoDbProvider } from "../providers/dynamodb.provider";
import { SeedService } from "./seed.service";

@Global()
@Module({
  providers: [DynamoDbProvider, SeedService],
  exports: [DynamoDbProvider],
})
export class DatabaseModule {}
