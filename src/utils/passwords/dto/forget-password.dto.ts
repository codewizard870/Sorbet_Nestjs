import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class ForgetPasswordDto {
  

   @ApiProperty()
   password:string
}
