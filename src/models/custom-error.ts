import { HttpStatusCode } from "axios";

export class CustomError {
  statusCode: HttpStatusCode;
  errors: object[];

  constructor(statusCode: HttpStatusCode, errors?: object[]) {
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
