import { ApiProperty } from "@nestjs/swagger"
import { Content } from "@prisma/client"
import { IsOptional } from "class-validator"

export class CreatePostDto {

    @ApiProperty()
    @IsOptional()
    text: string
    
    @ApiProperty()
    timestamp: Date

    @ApiProperty({
        description: 'description of the Post Content ',
        enum: Content,
      })
    content: Content
}
