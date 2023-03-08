import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { v4 as uuidv4 } from "uuid";
import { InputRequestPackageDto } from "./models/input.dto";
import { Status } from "@functions/request-create-users/models/enum";
import { validate } from "class-validator";
import { ExceptionMapService } from "@functions/request-create-users/services/exception-map.service";
import { RequestPackageService } from "./services/request-package.service";
import { HttpStatusCode } from "axios";
import { CustomError } from "@models/custom-error";

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { body } = event;
  const uuid = uuidv4();

  const rawInput = {
    uuid,
    status: Status.PENDING,
    createdDate: new Date().toISOString(),
    ...body,
  };

  const input = new InputRequestPackageDto(rawInput as any);
  const errors = await validate(input);

  if (errors.length) {
    return new ExceptionMapService().mapping(
      HttpStatusCode.BadRequest,
      errors.map(({ constraints }) => constraints)
    );
  }

  try {
    const requestPackageService = new RequestPackageService();
    await requestPackageService.create(input);
  } catch (error) {
    if (error instanceof CustomError)
      return new ExceptionMapService().mapping(error.statusCode, error.errors);
  }

  return formatJSONResponse({
    message: input,
  });
};

export const main = middyfy(createUser);
