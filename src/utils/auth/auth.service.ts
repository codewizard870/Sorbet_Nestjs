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
import { ServerResponse } from "http";
import { ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { sendEmail } from "./constants";
import jwt_decode, { JwtPayload } from "jwt-decode";
import * as dotenv from "dotenv";
dotenv.config();

const BaseUrl = process.env.BASEURL;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
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


  async signUpWithWallet(address: string) {
    try {
      const user = await this.usersService.getUserFromNearWallet(address)
      return new Promise(async (resolve, reject) => {
        if (user) {
          // console.log('User already exists')
          const token = this.generateToken(address)
          if (token) {
            console.log('User successfully signed in')

            resolve(token);
          }
          // return { message: 'User already exists' }
        } else {
          const token = this.generateToken(address)
          const newUser = await this.usersService.create(address, token);
          if (newUser) {
            resolve(token);
            return token;
          } else {
            reject('User could not be signed up')
          }
        }
      })
    } catch (error) {
      console.log(error);
    }

  }

  async signInWithWallet(address: string) {
    try {
      const user = await this.usersService.getUserFromNearWallet(address)
      if (user) {
        const token = this.generateToken(address)
        if (token) {
          console.log('User successfully signed in')
          return token
        }
        else throw new Error("Error signing user in")
      } else {
        this.signUpWithWallet(address);
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
