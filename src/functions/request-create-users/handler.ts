import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { v4 as uuidv4 } from "uuid";
import { InputCreateDto } from "./models/input.dto";
import { validate } from "class-validator";
import { Status } from "./models/enum";
import { CreateUserServices } from "./services/create-user.service";
import { ExceptionMapService } from "./services/exception-map.service";
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
  const input = new InputCreateDto(rawInput as any);
  const errors = await validate(input);

  if (errors.length) {
    return new ExceptionMapService().mapping(
      HttpStatusCode.NotFound,
      errors.map(({ constraints }) => constraints)
    );
  }

  const createUserService = new CreateUserServices();
  try {
    await createUserService.createUser(input);
  } catch (errorCode) {
    if (errorCode instanceof CustomError)
      return new ExceptionMapService().mapping(
        errorCode.statusCode,
        errorCode.errors
      );
  }

  return formatJSONResponse({
    message: input,
  });
};

export const main = middyfy(createUser);
