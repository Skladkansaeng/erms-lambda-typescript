import {
  TABLE_REQUEST_PACKAGE,
  TABLE_USER_PACKAGE,
} from "@configs/request-package";
import { ParamsQuery } from "@functions/approve-create-users/models/param-query.model";
import { Status } from "@functions/request-create-users/models/enum";
import { createDynamoDBClient } from "@libs/dynamo-client";
import { CustomError } from "@models/custom-error";
import { HttpStatusCode } from "axios";
import { InputApprovePackageDto } from "../models/input.dto";
import { v4 as uuidv4 } from "uuid";

export class ApprovePackageService {
  async approvePackage(input: InputApprovePackageDto) {
    const { requestUuid } = input;

    const paramsQuery: ParamsQuery = {
      TableName: TABLE_REQUEST_PACKAGE,
    };

    if (requestUuid) {
      paramsQuery.KeyConditionExpression = "#uuid = :value";
      paramsQuery.ExpressionAttributeValues = { ":value": requestUuid };
      paramsQuery.ExpressionAttributeNames = { "#uuid": "uuid" };
    }

    const docClient = createDynamoDBClient();
    const value = await docClient.query(paramsQuery as any).promise();
    if (!value.Count) throw new CustomError(HttpStatusCode.NotFound, []);
    const [item] = value.Items;
    if (item.status === Status.APPROVE || item.status === Status.REJECT)
      throw new CustomError(HttpStatusCode.Conflict, [
        { error: "status has been change!!" },
      ]);

    if (input.status === Status.APPROVE) {
      const uuid = uuidv4();
      await docClient
        .put({
          TableName: TABLE_USER_PACKAGE,
          Item: {
            ...item,
            status: input.status,
            approveBy: input.approveBy,
            packageRequest: requestUuid,
            reason: input.reason,
            uuid,
          },
        })
        .promise();
    }
    await docClient
      .put({
        TableName: TABLE_REQUEST_PACKAGE,
        Item: {
          ...item,
          status: input.status,
          approveBy: input.approveBy,
          reason: input.reason,
        },
      })
      .promise();
  }
}
