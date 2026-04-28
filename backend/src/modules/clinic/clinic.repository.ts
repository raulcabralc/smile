import { Inject, Injectable } from "@nestjs/common";
import { DYNAMO_DB_CLIENT } from "../../common/providers/dynamodb.provider";
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { ClinicEntity } from "./clinic.entity";
import { DynamoTable } from "../../common/types/enums/dynamo-table.enum";

@Injectable()
export class ClinicRepository {
  constructor(
    @Inject(DYNAMO_DB_CLIENT) private readonly ddb: DynamoDBDocumentClient,
  ) {}

  async findAll(): Promise<ClinicEntity[]> {
    const command = new ScanCommand({
      TableName: DynamoTable.SmileTable,
      FilterExpression: "begins_with(sk, :metadata)",
      ExpressionAttributeValues: {
        ":metadata": "METADATA#",
      },
    });

    const result = await this.ddb.send(command);

    return result.Items as ClinicEntity[];
  }

  async findById(id: string): Promise<ClinicEntity> {
    const command = new GetCommand({
      TableName: DynamoTable.SmileTable,
      Key: {
        pk: `CLINIC#${id}`,
        fk: `METADATA#${id}`,
      },
    });

    const result = await this.ddb.send(command);

    return result.Item as ClinicEntity;
  }
}
