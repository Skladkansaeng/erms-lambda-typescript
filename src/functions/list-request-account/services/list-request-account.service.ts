import { TABLE_REQUEST_CREATE_USER } from "@configs/user-approve-flow";
import { ParamsQuery } from "@functions/approve-create-users/models/param-query.model";
import { Status } from "@functions/request-create-users/models/enum";
import { createDynamoDBClient } from "@libs/dynamo-client";
import { CustomError } from "@models/custom-error";
import { HttpStatusCode } from "axios";
import { groupBy } from "lodash";

export class ListAccountRequest {
  async list() {
    const paramsQuery: ParamsQuery = {
      TableName: TABLE_REQUEST_CREATE_USER,
      IndexName: "status",
    };

    paramsQuery.KeyConditionExpression = "#status = :value";
    paramsQuery.ExpressionAttributeValues = { ":value": Status.PENDING };
    paramsQuery.ExpressionAttributeNames = { "#status": "status" };

    const docClient = createDynamoDBClient();
    const { Items } = await docClient.query(paramsQuery as any).promise();
    return groupBy(Items, "selectProduct");
  }

  async get(uuid: string) {
    const paramsQuery: ParamsQuery = {
      TableName: TABLE_REQUEST_CREATE_USER,
    };

    paramsQuery.KeyConditionExpression = "#uuid = :value";
    paramsQuery.ExpressionAttributeValues = { ":value": uuid };
    paramsQuery.ExpressionAttributeNames = { "#uuid": "uuid" };

    const docClient = createDynamoDBClient();
    const { Items } = await docClient.query(paramsQuery as any).promise();
    if (Items.length > 1) throw new CustomError(HttpStatusCode.Conflict);
    if (Items.length === 0) throw new CustomError(HttpStatusCode.NotFound);
    return Items[0];
  }
}
