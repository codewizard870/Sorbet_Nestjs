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
          console.log(newUser, "User successfully signed up")
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
          return {user};
          // return user.confirmationCode;
      } else {
        throw new Error('Error signing user in')
      }
    }
    catch (error) {
      console.log(error)
      throw new Error('Error signing user in')
    }
  }

  async signUpWithEmail(firstName: string, lastName: string, email: string, accountId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      })
      if (!user) {        
        const result = await this.prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            accountId: accountId,
          },
        })
        if (result) {
          return result
        }
        } else {
          throw new Error('User is aready exist')
        }
      }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
    }
  }

  async signInWithEmail(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email},
      })
      if (user) {
        // const token = "";
        // console.log(token, typeof token, '!!!');
        // const result = await this.prisma.user.update({
        //   where: { email: email },
        //   data: {
        //     token: token,
        //     updatedAt: new Date(Date.now())
        //   }
        // })
        return {user};
      }
      else {
        return {status: 'User is not exist'}
      }
    }
    catch (error) {
      console.error(error)
      throw new Error("An error occured. Please try again.")
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
