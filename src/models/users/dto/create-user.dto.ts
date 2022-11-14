import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserDto {
    @IsOptional()
    @ApiProperty()
    firstName:string

    @IsOptional()
    @ApiProperty()
    lastName:string

    @ApiProperty()
    email:string

    @ApiProperty()
    password:string

    @IsOptional()
    @ApiProperty()
    jobProfile:string

    @IsOptional()
    @ApiProperty()
    location:string
    
    @IsOptional()
    @ApiProperty()
    bio:string
    
    @IsOptional()
    @ApiProperty()
    status:String     
}
