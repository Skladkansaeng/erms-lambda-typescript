import { IsDateString, IsEmail, IsString } from "class-validator";

export class InputCreateDto {
  @IsString()
  uuid: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  millID: string;

  @IsString()
  defaultLanguage: string;

  @IsString()
  permission: string;

  @IsString()
  requester: string;

  @IsString()
  selectProduct: string;

  @IsString()
  maStartDate: string;

  @IsDateString()
  createdDate: string;

  @IsString()
  status: string;

  product: any;

  constructor(input?: InputCreateDto) {
    const {
      uuid,
      username,
      email,
      millID,
      defaultLanguage,
      permission,
      requester,
      selectProduct,
      maStartDate,
      product,
      status,
      createdDate,
    } = input ?? {};

    this.uuid = uuid;
    this.username = username;
    this.email = email;
    this.millID = millID;
    this.defaultLanguage = defaultLanguage;
    this.permission = permission;
    this.requester = requester;
    this.selectProduct = selectProduct;
    this.maStartDate = maStartDate;
    this.product = product;
    this.status = status;
    this.createdDate = createdDate;
  }
}
