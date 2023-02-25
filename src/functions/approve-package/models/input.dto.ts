import { Status } from "@functions/request-create-users/models/enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class InputApprovePackageDto {
  @IsString()
  requestUuid: string;

  @IsEnum(Status)
  status: string;

  @IsString()
  @IsOptional()
  approveBy: string;

  @IsString()
  @IsOptional()
  reason: string;

  constructor(input: InputApprovePackageDto) {
    const { requestUuid, reason, status, approveBy } = input;
    this.requestUuid = requestUuid;
    this.reason = reason;
    this.approveBy = approveBy;
    this.status = status;
  }
}
