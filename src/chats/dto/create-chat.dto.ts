import { ApiProperty } from "@nestjs/swagger"

export class CreateChatDto {
@ApiProperty()
    message: String
    
    @ApiProperty()
    contactId: String
    
}
