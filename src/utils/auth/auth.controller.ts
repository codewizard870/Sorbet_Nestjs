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
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signUpWithWallet')
  signUpWithWallet(@Body("address") address:string) {
    return this.authService.signUpWithWallet(address)
  }

  @Post('signInWithWallet')
  signInWithWallet(@Body("address") address:string) {
    return this.authService.signInWithWallet(address)
  }

  @Get('getUserById')
  getUserById(@Body() id:string) {
    return this.authService.getUserById(id)
  }

  @Get('getUserByWalletAddress')
  getUserByWalletAddress(@Body() address:string) {
    return this.authService.getUserByWalletAddress(address)
  }
}
