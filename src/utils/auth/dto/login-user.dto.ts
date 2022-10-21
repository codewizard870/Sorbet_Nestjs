import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @Length(5, 60)
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(5, 255)
  password: string;
}
