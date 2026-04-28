import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DYNAMO_DB_CLIENT } from "../providers/dynamodb.provider";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ConfigService } from "@nestjs/config";
import {
  CreateTableCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";
import * as bcrypt from "bcrypt";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @Inject(DYNAMO_DB_CLIENT) private readonly ddb: DynamoDBDocumentClient,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get("NODE_ENV") === "development") {
      await this.createTableIfNotExists();
    }
  }

  private async createTableIfNotExists() {
    const tableName = this.configService.get("DYNAMODB_TABLE_NAME");

    try {
      await this.ddb.send(new DescribeTableCommand({ TableName: tableName }));

      this.logger.log(`Table ${tableName} already exists. Skipping creation.`);
    } catch (e: any) {
      if (e.name === "ResourceNotFoundException") {
        this.logger.warn(`Table ${tableName} not found. Creating table...`);

        await this.createTable(tableName);
      } else {
        this.logger.error(`Error while verifying table: `, e);
      }
    }
  }

  private async createTable(tableName: string) {
    const command = new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" },
        { AttributeName: "sk", KeyType: "RANGE" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "EmailIndex",
          KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    try {
      await this.ddb.send(command);
      this.logger.log(`Table ${tableName} created successfully.`);
      await this.seedInitialData(tableName);
    } catch (e) {
      this.logger.error("Error while creating table: ", e);
    }
  }

  private async seedInitialData(tableName: string) {
    this.logger.log("Inserting initial seed data...");

    const adminId = "0000-0000-0000-0000";
    const clinicId = "demo-clinic-123";
    const plainPassword = "admin123";

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const userCommand = new PutCommand({
      Item: {
        pk: `CLINIC#${clinicId}`,
        sk: `USER#admin@smile.com`,
        id: adminId,
        clinicId: clinicId,
        name: "Admin Smile",
        email: "admin@smile.com",
        password: passwordHash,
        role: "ADMIN",
        createdAt: new Date().toISOString(),
      },
      TableName: tableName,
    });

    const clinicCommand = new PutCommand({
      Item: {
        pk: `CLINIC#${clinicId}`,
        sk: `METADATA#${clinicId}`,
        id: clinicId,
        name: "VITA Odontologia",
        cnpj: "12.345.678/0001-90",
        createdAt: new Date().toISOString(),
      },
      TableName: tableName,
    });

    await this.ddb.send(userCommand);

    await this.ddb.send(clinicCommand);

    this.logger.log("Initial data inserted successfully.");
  }
}
