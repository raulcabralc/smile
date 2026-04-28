import { Provider } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { ConfigService } from "@nestjs/config";

export const DYNAMO_DB_CLIENT = "DYNAMO_DB_CLIENT";

export const DynamoDbProvider: Provider = {
  provide: DYNAMO_DB_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const isLocal = configService.get<string>("NODE_ENV") === "development";

    const endpoint =
      configService.get<string>("AWS_ENDPOINT") || "http://localhost:4566";

    const client = new DynamoDBClient({
      region: configService.get<string>("AWS_REGION") || "us-east-1",
      endpoint: isLocal ? endpoint : undefined,
      credentials: {
        accessKeyId: isLocal
          ? "test"
          : (configService.get("AWS_ACCESS_KEY_ID") as string),
        secretAccessKey: isLocal
          ? "test"
          : (configService.get("AWS_SECRET_ACCESS_KEY") as string),
      },
    });

    return DynamoDBDocument.from(client);
  },
};
