import { ExceptionMapService } from "@functions/request-create-users/services/exception-map.service";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CustomError } from "@models/custom-error";
import { HttpStatusCode } from "axios";
import { validate } from "class-validator";
import { InputApprovePackageDto } from "./models/input.dto";
import { ApprovePackageService } from "./services/approve-package.service";

const createUser: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event: any
) => {
  const { body } = event;

  const input = new InputApprovePackageDto(body as any);
  const errors = await validate(input);

  if (errors.length) {
    return new ExceptionMapService().mapping(
      HttpStatusCode.BadRequest,
      errors.map(({ constraints }) => constraints)
    );
  }

  try {
    await new ApprovePackageService().approvePackage(input);
  } catch (error) {
    if (error instanceof CustomError)
      return new ExceptionMapService().mapping(error.statusCode, error.errors);
  }

  return formatJSONResponse({
    message: input,
  });
};

export const main = middyfy(createUser);
