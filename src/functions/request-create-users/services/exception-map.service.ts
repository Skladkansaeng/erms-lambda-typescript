import { formatJSONResponse } from "@libs/api-gateway";
import { HttpStatusCode } from "axios";

export class ExceptionMapService {
  constructor() {}

  mapping(code, data?: object[]) {
    const errors = data ?? [];

    switch (code) {
      case HttpStatusCode.InternalServerError:
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
