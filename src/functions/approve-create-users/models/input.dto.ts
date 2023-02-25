import { Status } from "@functions/request-create-users/models/enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class InputApproveDto {
  @IsString()
  @IsOptional()
  uuid: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsEnum(Status)
  status: string;

  @IsString()
  @IsOptional()
  approveBy: string;

  @IsString()
  @IsOptional()
  reason: string;

  constructor(input: InputApproveDto) {
    const { uuid, username, status, approveBy, reason } = input;
    this.uuid = uuid;
    this.username = username;
    this.status = status;
    this.approveBy = approveBy;
    this.reason = reason;
  }
}
