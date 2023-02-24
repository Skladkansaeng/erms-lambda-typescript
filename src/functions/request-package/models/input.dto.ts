import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class InputRequestPackageDto {
  @IsString()
  uuid: string;

  @IsString()
  username: string;

  @IsString()
  packageUuid: string;

  @IsString()
  requester: string;

  @IsString()
  status: string;

  @IsString()
  startDate: string;

  @IsString()
  expireDate: string;

  @IsDateString()
  createdDate: string;

  @IsNumber()
  @IsOptional()
  maxUsage: number;

  constructor(input: InputRequestPackageDto) {
    const {
      uuid,
      username,
      packageUuid,
      requester,
      status,
      startDate,
      expireDate,
      createdDate,
      maxUsage,
    } = input;

    this.uuid = uuid;
    this.username = username;
    this.packageUuid = packageUuid;
    this.requester = requester;
    this.status = status;
    this.startDate = startDate;
    this.expireDate = expireDate;
    this.createdDate = createdDate;
    this.maxUsage = maxUsage;
  }
}
