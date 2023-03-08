import { TABLE_PACKAGE, TABLE_REQUEST_PACKAGE } from "@configs/request-package";
import { Status } from "@functions/request-create-users/models/enum";
import { createDynamoDBClient } from "@libs/dynamo-client";
import { CustomError } from "@models/custom-error";
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

  private async getRequestPackage(username: string) {
    const paramsQuery = {
      TableName: TABLE_REQUEST_PACKAGE,
      IndexName: "username",
      KeyConditionExpression: "#username = :value",
      ExpressionAttributeValues: { ":value": username },
      ExpressionAttributeNames: { "#username": "username" },
    };
    const value = await this.docClient.query(paramsQuery).promise();
    return value?.Items?.filter(({ status }) => status !== Status.REJECT);
  }

  private compareBetweenDate(start_date, end_date, compare_date) {
    const start = Date.parse(start_date);
    const end = Date.parse(end_date);
    const d = Date.parse(compare_date);
    return d >= start && d <= end;
  }

  async create(input: InputRequestPackageDto) {
    const packageValue = await this.getPackage(input.packageUuid);

    if (!packageValue.length)
      throw new CustomError(HttpStatusCode.NotFound, []);

    const requestPackages = await this.getRequestPackage(input.username);
    const dateInValid = requestPackages.some(({ expireDate, startDate }) => {
      return this.compareBetweenDate(startDate, expireDate, input.startDate);
    });

    if (dateInValid) throw new CustomError(HttpStatusCode.Conflict, []);

    await this.docClient
      .put({
        TableName: TABLE_REQUEST_PACKAGE,
        Item: input,
      })
      .promise();
    return input;
  }
}
