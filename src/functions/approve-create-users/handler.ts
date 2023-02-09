import { ErrorCode } from "@functions/request-create-users/models/enum";
import { ExceptionMapServince } from "@functions/request-create-users/services/exception-map.service";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
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
    return new ExceptionMapServince().mapping(
      ErrorCode.BAD_REQUEST,
      errors.map(({ constraints }) => constraints)
    );
  }

  try {
    await new ApproveCreateServices().approveCreate(input);
  } catch (errorCode) {
    return new ExceptionMapServince().mapping(errorCode, [
      { error: "username or uuid doe't exits." },
    ]);
  }

  return formatJSONResponse({
    // message: uuid,
  });
};

export const main = middyfy(approveCreate);
