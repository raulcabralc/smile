import { Inject, Injectable } from "@nestjs/common";
import { DYNAMO_DB_CLIENT } from "../../common/providers/dynamodb.provider";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { ClinicEntity } from "./clinic.entity";
import { DynamoTable } from "../../common/types/enums/dynamo-table.enum";

@Injectable()
export class ClinicRepository {
  constructor(
    @Inject(DYNAMO_DB_CLIENT) private readonly ddb: DynamoDBDocumentClient,
  ) {}

  async findAll(): Promise<ClinicEntity[] | null> {
    const command = new ScanCommand({
      TableName: DynamoTable.SmileTable,
      FilterExpression: "begins_with(sk, :metadata)",
      ExpressionAttributeValues: {
        ":metadata": "METADATA#",
      },
    });

    const result = await this.ddb.send(command);

    if (!result.Items) return null;

    return result.Items?.map(
      (item) => new ClinicEntity(item as ClinicEntity),
    ) as ClinicEntity[];
  }

  async findOne(clinicId: string): Promise<ClinicEntity | null> {
    const command = new GetCommand({
      TableName: DynamoTable.SmileTable,
      Key: {
        pk: `CLINIC#${clinicId}`,
        sk: `METADATA#${clinicId}`,
      },
    });

    const result = await this.ddb.send(command);

    if (!result.Item) return null;

    return new ClinicEntity(result.Item as ClinicEntity);
  }

  async create(newClinic: ClinicEntity): Promise<ClinicEntity | null> {
    const command = new PutCommand({
      TableName: DynamoTable.SmileTable,
      Item: newClinic,
    });

    const result = await this.ddb.send(command);

    if (!result) return null;

    return new ClinicEntity(newClinic);
  }
}
