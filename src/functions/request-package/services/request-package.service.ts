import { TABLE_PACKAGE, TABLE_REQUEST_PACKAGE } from "@configs/request-package";
import { createDynamoDBClient } from "@libs/dynamo-client";
import { HttpStatusCode } from "axios";
import { InputRequestPackageDto } from "../models/input.dto";

export class RequestPackageService {
  docClient: any;
  constructor() {
    this.docClient = createDynamoDBClient();
  }

  private async getPackage(uuid: string) {
    const paramsQuery = {
      TableName: TABLE_PACKAGE,
      KeyConditionExpression: "#uuid = :value",
      ExpressionAttributeValues: { ":value": uuid },
      ExpressionAttributeNames: { "#uuid": "uuid" },
    };

    const value = await this.docClient.query(paramsQuery).promise();
    return value?.Items;
  }

  async create(input: InputRequestPackageDto) {
    const packageValue = await this.getPackage(input.packageUuid);
    if (!packageValue.length) throw HttpStatusCode.NotFound;

    await this.docClient
      .put({
        TableName: TABLE_REQUEST_PACKAGE,
        Item: input,
      })
      .promise();
    return input;
  }
}
