import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    firstName:string

    @ApiProperty()
    lastName:string

    @ApiProperty()
    email:string

    @ApiProperty()
    password:string

    @ApiProperty()
    jobProfile:string

    @ApiProperty()
    location:string
    
    @ApiProperty()
    bio:string
    
    @ApiProperty()
    status:String     
}
