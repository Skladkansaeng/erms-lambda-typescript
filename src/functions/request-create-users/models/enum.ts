export enum Status {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  PENDING = "PENDING",
}

export enum ErrorCode {
  USERNAME_EXITS = 409,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
  NOT_FOUND = 404,
}
