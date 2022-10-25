import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForgetPasswordDto } from 'src/utils/passwords/dto/forget-password.dto';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { LoginUserDto } from './dto/login-user.dto';
@ApiBearerAuth()
@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async Login(@Body() createAuthDto: LoginUserDto) {
    return await this.authService.validateUser(
      createAuthDto.email,
      createAuthDto.password,
    );
  }


  @Public()
  @Post('signup')
  async signUp(@Body() data: CreateUserDto) {
    return await this.authService.register(data);
  }

  @Public()
  @Get('confirm/:confirmationCode')
    async verifyUserEmail(@Param('confirmationCode') confirmationCode: string) {
      return await this.authService.verifyUserEmail(confirmationCode);
    }

    @Public()
    @Post('requestResetPassword/:email')
    async requestResetPassword(@Param('email') email: string) {
      return await this.authService.requestPasswordReset(email);
    }

    @Public()
    @Post('resetPassword')
    async resetPassword(@Body()forgetPassword:ForgetPasswordDto){
      return await this.authService.requestPasswordReset(forgetPassword);
    }

}
