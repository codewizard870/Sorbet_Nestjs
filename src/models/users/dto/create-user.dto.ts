import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @ApiProperty()
  firstName: String;

  @IsOptional()
  @ApiProperty()
  lastName: String;

  @ApiProperty()
  email: String;

  @ApiProperty()
  password: String;

  @IsOptional()
  @ApiProperty()
  bio: String;

  @IsOptional()
  @ApiProperty()
  status: String;

  @ApiProperty()
  magicAuthentication: Boolean
}
