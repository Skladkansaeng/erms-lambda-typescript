import { ExceptionMapService } from "@functions/request-create-users/services/exception-map.service";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CustomError } from "@models/custom-error";
import { ListPackageRequest } from "./services/list-package.service";

const listPackage: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  console.log("🚀 ~ file: handler.ts:11 ~ event:", event)
  try {
    const listPackage = await new ListPackageRequest().listPackageRequest();
    return formatJSONResponse({
      data: listPackage,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      return new ExceptionMapService().mapping(error.statusCode, error.errors);
  }
};

export const main = middyfy(listPackage);
