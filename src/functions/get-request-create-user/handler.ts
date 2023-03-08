import { ListAccountRequest } from "@functions/list-request-account/services/list-request-account.service";
import { ExceptionMapService } from "@functions/request-create-users/services/exception-map.service";
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CustomError } from "@models/custom-error";
const getAccountRequest: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  try {
    const listAccount = await new ListAccountRequest().get(
      event["pathParameters"]["uuid"]
    );
    return formatJSONResponse({
      data: listAccount
    });
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      return new ExceptionMapService().mapping(error.statusCode, error.errors);
  }
};

export const main = middyfy(getAccountRequest);
