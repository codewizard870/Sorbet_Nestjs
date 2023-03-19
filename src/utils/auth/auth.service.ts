import { PasswordsService } from "src/utils/passwords/passwords.service";
/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/utils/prisma/prisma.service";
import { UsersService } from "src/models/users/users.service";
import { ApiInternalServerErrorResponse } from "@nestjs/swagger";
import jwt_decode, { JwtPayload } from "jwt-decode";
import * as dotenv from "dotenv";
dotenv.config();

const BaseUrl = process.env.BASEURL;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordsService: PasswordsService
  ) { }

  generateToken(address: string) {
    const payload = {
      address
    };
    const token = this.jwtService.sign(payload);
    return token;
  }


  async signUpWithWallet(address: string, email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { nearWallet: address },
      })

      if (user) {
        throw new Error("Already registered")
      } else {
        // const token = this.generateToken(address)
        const token = "";
        const newUser = await this.usersService.create(address, email, token);
        if (newUser) {
          console.log("User successfully signed up")
          return newUser;
        }
        else
          throw new Error("Error signing user up")
      }
    } catch (error) {
      console.log(error)
      throw new Error("Error signing user up")
    }
  }

  async signInWithWallet(address: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { nearWallet: address },
      })
      if (user) {
          console.log('User successfully signed in')
          return user.confirmationCode;
      } else {
        throw new Error('Error signing user in')
      }
    }
    catch (error) {
      console.log(error)
      throw new Error('Error signing user in')
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersService.getUserFromNearWallet(id)
      if (user) {
        return user
      }
      else {
        console.log("Could not find user by id")
        throw new Error("Could not find user by id")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Error finding user by id")
    }
  }

  async getUserByWalletAddress(address: string) {
    try {
      const user = await this.usersService.getUserFromNearWallet(address)
      if (user) {
        return user
      }
      else {
        console.log("Could not find user by wallet address")
        throw new Error("Could not find user by wallet address")
      }
    }
    catch (error) {
      console.log(error)
      throw new Error("Error finding user by wallet address")
    }
  }
}
