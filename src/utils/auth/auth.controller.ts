import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ForgetPasswordDto } from "src/utils/passwords/dto/forget-password.dto";
import { CreateUserDto } from "src/models/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Public } from "./constants";
import { LoginUserDto } from "./dto/login-user.dto";
import { userInfo } from "os";
@ApiBearerAuth()
@ApiTags("auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signin")
  async Login(@Body() createAuthDto: LoginUserDto) {
    return await this.authService.validateUser(
      createAuthDto.email,
      createAuthDto.password
    );
  }

  @Public()
  @Post("signup")
  async signUp(@Body() data: CreateUserDto) {
    return await this.authService.register(data);
  }

  // @Public()
  // @Get("resetPassword")
  // async resetPassword(
  //   @Query("token") token: string,
  //   @Query("userId") userId: string,
  //   @Body() forgetPassword: ForgetPasswordDto
  // ) {
  //   return await this.authService.resetPassword(
  //     userId,
  //     token,
  //     forgetPassword.password
  //   );
  // }
}
