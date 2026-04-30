import { Inject, Injectable, Logger } from "@nestjs/common";
import { DYNAMO_DB_CLIENT } from "../../common/providers/dynamodb.provider";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoTable } from "../../common/types/enums/dynamo-table.enum";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DYNAMO_DB_CLIENT) private readonly ddb: DynamoDBDocumentClient,
  ) {}

  async findAll(clinicId: string): Promise<UserEntity[]> {
    const command = new QueryCommand({
      TableName: DynamoTable.SmileTable,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :user)",
      ExpressionAttributeValues: {
        ":pk": `CLINIC#${clinicId}`,
        ":user": "USER#",
      },
    });

    const result = await this.ddb.send(command);

    return result.Items?.map(
      (item) => new UserEntity(item as UserEntity),
    ) as UserEntity[];
  }

  async findOne(clinicId: string, id: string): Promise<UserEntity | null> {
    const command = new GetCommand({
      TableName: DynamoTable.SmileTable,
      Key: {
        pk: `CLINIC#${clinicId}`,
        sk: `USER#${id}`,
      },
    });

    const result = await this.ddb.send(command);

    if (!result.Item) return null;

    return new UserEntity(result.Item as UserEntity);
  }

  ///

  async findByEmail(clinicId: string, email: string): Promise<boolean> {
    const command = new GetCommand({
      TableName: DynamoTable.SmileTable,
      Key: {
        pk: `CLINIC#${clinicId}`,
        email: email,
      },
    });

    const result = await this.ddb.send(command);

    return !!result;
  }
}
