import { ApiProperty } from "@nestjs/swagger";

export class CreateContactDto {
  @ApiProperty()
  contacted_userId: string

  @ApiProperty()
  userId: string;
}
