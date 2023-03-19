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
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('signUpWithWallet')
  signUpWithWallet(@Body("address") address: string, @Body("email") email: string) {
    return this.authService.signUpWithWallet(address, email)
  }

  @Post('signInWithWallet')
  signInWithWallet(@Body("address") address: string) {
    return this.authService.signInWithWallet(address)
  }
}
