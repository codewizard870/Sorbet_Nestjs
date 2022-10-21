import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class ForgetPasswordDto {
  
  @ApiProperty()
  userId:string

  @ApiProperty()
   token:string 

   @ApiProperty()
   password:string
}
