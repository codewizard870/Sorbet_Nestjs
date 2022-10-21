import { PasswordsService } from 'src/utils/passwords/passwords.service';
/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UsersService } from 'src/models/users/users.service';
import { ServerResponse } from 'http';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { sendEmail } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly passwordsService: PasswordsService,
  ) {}

   generateToken(user: any) {
    const payload = {
      email: user.email,
    };

    const token=this.jwtService.sign(payload);
    return  token;
    
  }

  async register(data){
    const existingUser=await this.usersService.getUserFromEmail(data.email);
if(existingUser){
throw new BadRequestException({ message: "Failed! Email is already in use!" });
}
else{
    var token = this.generateToken(data);
const user=await this.usersService.create(data,token);
if(user){
  const content = {
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
            <h2>Hello ${user.firstName}</h2>
            <p>Thank you for signing up. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:3003/confirm/${user.confirmationCode}> Click here</a>
            </div>`,
  };
  sendEmail(user.firstName, user.email, content);

  return {message: "User was registered successfully! Please check your email"}
}
  else{
    throw new BadRequestException();
  }
}
}
  
 
  
  async verifyUserEmail (user)  {
   return await this.usersService.verifyUserEmail(user);
  }
  
async validateUser(email: string, pass: string): Promise<any> {
   try{ 
    const user = await this.usersService.validateUser(email, pass);
    if (user) {
      console.log("user in validate User",user);
      
      const newUser = this.loginUser(user);
      return newUser;
    } else {
      throw new UnauthorizedException('Inavalid User Name or password');
    }
  }catch(error)
  {
throw error;
  }
  }

 async loginUser(user: any) {
    const access_token = await this.generateToken(user);

    const obj={id: user._id,
    email: user.email,
    firstName:user.firstName,
    lastName:user.lastName,
    jobProfile: user.jobProfile,
    location: user.location,
    bio: user.bio,
    profileImage: user.profileImage,
    accessToken: access_token
  }

    return obj;
  }

 async requestPasswordReset(email){
  const user= await this.usersService.getUserFromEmail(email);

  console.log("user",user);
  
  if(user){
    return await this.passwordsService.requestPasswordReset(user);
  }
  else{
    throw new BadRequestException("This user does not exists");
  }

 }

 async resetPassword(userId, token, password){
return await this.passwordsService.resetPassword(userId, token, password);
 }

  

 


}
