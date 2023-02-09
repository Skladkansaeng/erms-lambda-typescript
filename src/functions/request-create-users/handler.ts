import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { v4 as uuidv4 } from "uuid";
import { InputCreateDto } from "./models/input.dto";
import { validate } from "class-validator";
import { ErrorCode, Status } from "./models/enum";
import { CreateUserServices } from "./services/create-user.service";
import { ExceptionMapServince } from "./services/exception-map.service";

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
    return new ExceptionMapServince().mapping(
      ErrorCode.BAD_REQUEST,
      errors.map(({ constraints }) => constraints)
    );
  }

  const createUserService = new CreateUserServices();
  try {
    await createUserService.createUser(input);
  } catch (errorCode) {
    return new ExceptionMapServince().mapping(errorCode);
  }

  return formatJSONResponse({
    message: uuid,
  });
};

export const main = middyfy(createUser);
