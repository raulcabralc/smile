import { Inject, Injectable } from "@nestjs/common";
import { DYNAMO_DB_CLIENT } from "../../common/providers/dynamodb.provider";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
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

  async create(newUser: UserEntity): Promise<UserEntity> {
    const command = new PutCommand({
      TableName: DynamoTable.SmileTable,
      Item: newUser,
    });

    await this.ddb.send(command);

    return new UserEntity(newUser);
  }

  async update(updatedUser: UserEntity): Promise<UserEntity> {
    const command = new PutCommand({
      TableName: DynamoTable.SmileTable,
      Item: updatedUser,
    });

    await this.ddb.send(command);

    return new UserEntity(updatedUser);
  }

  async delete(clinicId: string, id: string): Promise<boolean | null> {
    const command = new DeleteCommand({
      TableName: DynamoTable.SmileTable,
      Key: {
        pk: `CLINIC#${clinicId}`,
        sk: `USER#${id}`,
      },
    });

    const result = await this.ddb.send(command);

    if (!result) return null;

    return true;
  }

  ///

  async findByEmail(email: string): Promise<UserEntity | null> {
    const command = new QueryCommand({
      TableName: DynamoTable.SmileTable,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });

    const result = await this.ddb.send(command);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return new UserEntity(result.Items[0] as UserEntity);
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    const command = new QueryCommand({
      TableName: DynamoTable.SmileTable,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });

    const result = await this.ddb.send(command);

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return new UserEntity(result.Items[0] as UserEntity);
  }
}
