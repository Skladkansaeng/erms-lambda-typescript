import { IS_ONLINE } from "@configs/app-config";
import * as AWS from "aws-sdk";

export const createDynamoDBClient = () => {
  if (!IS_ONLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: "us-west-2",
      accessKeyId: "local",
      secretAccessKey: "local",
      endpoint: "http://localhost:8000",
    });
  }
  return new AWS.DynamoDB.DocumentClient();
};
