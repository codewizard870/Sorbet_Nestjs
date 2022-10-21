import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator"

export class CreateGigDto {
    
    @ApiProperty()
    postId :string 

    @ApiProperty()
    start_date:  Date
    
    @ApiProperty()
    @IsOptional() 
    end_date:  Date
    
    @ApiProperty() 
    title:string

@ApiProperty()
description:string

@ApiProperty()
gig_price_min:number

@ApiProperty()
gig_price_max:number

@ApiProperty()
tags:  string[]


}
