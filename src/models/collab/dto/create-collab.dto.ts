import { ApiProperty } from "@nestjs/swagger";

export class CreateCollabDto {
  @ApiProperty()
  collabId: string;
  
  @ApiProperty()
  userId: string;

  @ApiProperty()
  wallet_address: string;

  @ApiProperty()
  public_key: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
