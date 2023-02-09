import { formatJSONResponse } from "@libs/api-gateway";
import { ErrorCode } from "../models/enum";

export class ExceptionMapServince {
  constructor() {}

  mapping(code, data?: object[]) {
    const errors = data ?? [];

    switch (code) {
      case ErrorCode.USERNAME_EXITS:
        errors.push({ username: "This username already exists." });
        break;
      case ErrorCode.SERVER_ERROR:
        errors.splice(0, errors.length);
        break;
    }

    return formatJSONResponse(
      {
        errors,
      },
      code
    );
  }
}
