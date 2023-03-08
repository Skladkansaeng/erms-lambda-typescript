import { ExceptionMapService } from "@functions/request-create-users/services/exception-map.service";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { CustomError } from "@models/custom-error";
import { HttpStatusCode } from "axios";
import { validate } from "class-validator";
import { InputApproveDto } from "./models/input.dto";
import schema from "./schema";
import { ApproveCreateServices } from "./services/approve-create.service";

const approveCreate: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { body } = event;
  const input = new InputApproveDto(body as any);
  const errors = await validate(input);

  if (errors.length) {
    return new ExceptionMapService().mapping(
      HttpStatusCode.BadRequest,
      errors.map(({ constraints }) => constraints)
    );
  }

  try {
    await new ApproveCreateServices().approveCreate(input);
  } catch (error) {
    if (error instanceof CustomError)
      return new ExceptionMapService().mapping(error.statusCode, error.errors);
  }

  return formatJSONResponse({
    message: body,
  });
};

export const main = middyfy(approveCreate);
