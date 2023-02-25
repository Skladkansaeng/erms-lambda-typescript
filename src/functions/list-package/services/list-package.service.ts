import { TABLE_REQUEST_PACKAGE } from "@configs/request-package";
import { ParamsQuery } from "@functions/approve-create-users/models/param-query.model";
import { Status } from "@functions/request-create-users/models/enum";
import { createDynamoDBClient } from "@libs/dynamo-client";

export class ListPackageRequest {
  async listPackageRequest() {
    const paramsQuery: ParamsQuery = {
      TableName: TABLE_REQUEST_PACKAGE,
      IndexName: "status",
    };

    paramsQuery.KeyConditionExpression = "#status = :value";
    paramsQuery.ExpressionAttributeValues = { ":value": Status.PENDING };
    paramsQuery.ExpressionAttributeNames = { "#status": "status" };

    const docClient = createDynamoDBClient();
    const value = await docClient.query(paramsQuery as any).promise();

    return value.Items;
  }
}
