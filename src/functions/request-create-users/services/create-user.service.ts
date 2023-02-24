import { TABLE_REQUEST_CREATE_USER } from "@configs/user-approve-flow";
import { createDynamoDBClient } from "@libs/dynamo-client";
import { CustomError } from "@models/custom-error";
import { HttpStatusCode } from "axios";
import { Status } from "../models/enum";
import { InputCreateDto } from "../models/input.dto";

export class CreateUserServices {
  constructor() {}

  async createUser(input: InputCreateDto) {
    const docClient = createDynamoDBClient();

    const paramsQuery = {
      TableName: TABLE_REQUEST_CREATE_USER,
      IndexName: "username",
      KeyConditionExpression: "#username = :value",
      ExpressionAttributeValues: { ":value": input.username },
      ExpressionAttributeNames: { "#username": "username" },
    };

    const value = await docClient.query(paramsQuery).promise();
    if (value.Count && value.Items?.pop().status !== Status.REJECT) {
      throw new CustomError(HttpStatusCode.Conflict, [
        { username: "This username already exists." },
      ]);
    }

    await docClient
      .put({
        TableName: TABLE_REQUEST_CREATE_USER,
        Item: input,
      })
      .promise();
  }
}
