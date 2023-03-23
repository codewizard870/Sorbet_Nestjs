import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
  @ApiProperty()
  userId: String;

  @ApiProperty()
  message: String;

  @ApiProperty()
  contactId: String;
}
