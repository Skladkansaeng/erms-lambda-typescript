import { Status } from "@functions/request-create-users/models/enum";
import { createDynamoDBClient } from "@libs/dynamo-client";
import axios, { HttpStatusCode } from "axios";
import { InputApproveDto } from "../models/input.dto";
import { ParamsQuery } from "../models/param-query.model";
import { omit } from "lodash";
import {
  API_CREATE_USER,
  TABLE_REQUEST_CREATE_USER,
} from "@configs/user-approve-flow";
import { CustomError } from "@models/custom-error";

export class ApproveCreateServices {
  async approveCreate(input: InputApproveDto) {
    const { uuid, username } = input;

    const paramsQuery: ParamsQuery = {
      TableName: TABLE_REQUEST_CREATE_USER,
    };

    if (uuid) {
      paramsQuery.KeyConditionExpression = "#uuid = :value";
      paramsQuery.ExpressionAttributeValues = { ":value": uuid };
      paramsQuery.ExpressionAttributeNames = { "#uuid": "uuid" };
    } else if (username) {
      paramsQuery.IndexName = "username";
      paramsQuery.KeyConditionExpression = "#username = :value";
      paramsQuery.ExpressionAttributeValues = { ":value": username };
      paramsQuery.ExpressionAttributeNames = { "#username": "username" };
    }

    const docClient = createDynamoDBClient();
    const value = await docClient.query(paramsQuery as any).promise();

    if (value.Count) {
      const [item] = value.Items.filter(
        ({ status }) => status === Status.PENDING
      );
      if (!item) {
        throw HttpStatusCode.NotFound;
      }

      let subId;
      if (input.status === Status.APPROVE) {
        try {
          const { data } = await axios.post(
            API_CREATE_USER,
            omit(item, "uuid")
          );
          subId = data.subID;
        } catch (err) {
          console.log(err);
          throw HttpStatusCode.InternalServerError;
        }
      }

      await docClient
        .put({
          TableName: TABLE_REQUEST_CREATE_USER,
          Item: {
            ...item,
            status: input.status,
            subId,
            approveBy: input.approveBy,
            reason: input.reason,
          },
        })
        .promise();

      return true;
    }

    throw new CustomError(HttpStatusCode.NotFound);
  }
}
