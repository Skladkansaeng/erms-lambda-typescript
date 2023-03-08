import { ExceptionMapService } from "@functions/request-create-users/services/exception-map.service";
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CustomError } from "@models/custom-error";
import { ListAccountRequest } from "./services/list-request-account.service";

const listAccountRequest: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  console.log("🚀 ~ file: handler.ts:11 ~ event:", event);
  try {
    const listAccount = await new ListAccountRequest().list();
    return formatJSONResponse({
      data: listAccount
    });
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      return new ExceptionMapService().mapping(error.statusCode, error.errors);
  }
};

export const main = middyfy(listAccountRequest);
