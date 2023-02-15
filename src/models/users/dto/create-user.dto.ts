import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @ApiProperty()
  nearWallet: String

  @IsOptional()
  @ApiProperty()
  firstName: String

  @IsOptional()
  @ApiProperty()
  lastName: String

  @ApiProperty()
  email: String

  @IsOptional()
  @ApiProperty()
  bio: String

  @IsOptional()
  @ApiProperty()
  profileImage: String

  
}
