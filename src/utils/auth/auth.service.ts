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
  ) {}

  generateToken(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
    };

    const token = this.jwtService.sign(payload);
    return token;
  }

  // async register(data) {
  //   const existingUser = await this.usersService.getUserFromEmail(data.email);
  //   if (existingUser) {
  //     throw new BadRequestException({
  //       message: "Failed! Email is already in use!",
  //     });
  //   } else {
  //     let token = this.generateToken(data);
  //     const user = await this.usersService.create(data, token);
  //     if (user) {
  //       const confirmationCode = this.generateToken(user);
  //       const updateToken = await this.usersService.updateUserProfile(
  //         user.id,
  //         confirmationCode
  //       );
  //       const content = {
  //         subject: "Please confirm your account",
  //         html: `<h1>Email Confirmation</h1>
  //           <h2>Hello ${user.firstName}</h2>
  //           <p>Thank you for signing up. Please confirm your email by clicking on the following link</p>
  //           <a href=${BaseUrl}/api/auth/confirm/${user.confirmationCode}> Click here</a>
  //           </div>`,
  //       };
  //       console.log(
  //         `link,${BaseUrl}/api/auth/confirm/${user.confirmationCode}`
  //       );
  //       // sendEmail(user.firstName, user.email, content);
  //       console.log("token", confirmationCode);

  //       return {
  //         message: "User was registered successfully! Please check your email",
  //       };
  //     } else {
  //       throw new BadRequestException();
  //     }
  //   }
  // }

  // async verifyUserEmail(confirmationCode) {
  //   let decoded: any = jwt_decode(confirmationCode);

  //   const email = decoded.email;

  //   return
  // }

  // async validateUser(email: string, pass: string): Promise<any> {
  //   try {
  //     let user: any
  //     // const user = await this.usersService.validateUser(email, pass);
  //     if (user) {
  //       console.log("user in validate User", user);

  //       const newUser = this.loginUser(user);
  //       return newUser;
  //     } else {
  //       throw new UnauthorizedException("Inavalid User Name or password");
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async loginUser(user: any) {
  //   const access_token = await this.generateToken(user);

  //   const obj = {
  //     id: user._id,
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     jobProfile: user.jobProfile,
  //     location: user.location,
  //     bio: user.bio,
  //     profileImage: user.profileImage,
  //     accessToken: access_token,
  //   };

  //   return obj;
  // }

  // async requestPasswordReset(email) {
  //   const user = await this.usersService.getUserFromEmail(email);
  //   console.log("user", user);
  //   if (user) {
  //     return await this.passwordsService.requestPasswordReset(user);
  //   } else {
  //     throw new BadRequestException("This user does not exists");
  //   }
  // }

  async signUpWithWallet(address: string) {
    try {
      const user = await this.usersService.getUserFromNearWallet(address)
      if (user) {
        console.log('User already exists')
        return { message: 'User already exists' }
      }
      const token = this.generateToken(user)
      const newUser = await this.usersService.create(address, token);
      if (newUser) {
        console.log('User successfully signed in')
        return { success: true }
      }
      else {
        console.log('User could not be signed in')
        return { success: false }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error('Error signing user in')
    }
  }

  async signInWithWallet(address: string) {
    try {
      const user = await this.usersService.getUserFromNearWallet(address)
      if (user) {
        const token = this.generateToken(user)
        if (token) {
          console.log('User successfully signed in')
          return token
        }
        else {
          console.log('User could not be signed in')
          return { success: false }
        } 
      }
      else {
        console.log('Could not find user')
        return { success: false }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error('Error signing user in')
    }
  }

  async signUpWithEmail(email: string) {
    try {
      const user = await this.usersService.getUserFromEmail(email)
      if (user) {
        console.log('User already exists')
        return { message: 'User already exists' }
      }
      const token = this.generateToken(user)
      const newUser = await this.usersService.create(email, token);
      if (newUser) {
        console.log('User successfully signed in')
        return { success: true }
      }
      else {
        console.log('User could not be signed in')
        return { success: false }
      }
    } 
    catch (error) {
      console.log(error)
      throw new Error('Error signing user in')
    }
  }

  async signInWithEmail(email: string) {
    try {
      const user = await this.usersService.getUserFromEmail(email)
      if (user) {
        const token = this.generateToken(user)
        if (token) {
          console.log('User successfully signed in')
          return token
        }
        else {
          console.log('User could not be signed in')
          return { success: false }
        } 
      }
      else {
        console.log('Could not find user')
        return { success: false }
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
