import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordsService } from 'src/utils/passwords/passwords.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordsService: PasswordsService,
  ) {}

  async create(data, token) {

       const user = await this.getUserFromEmail(data.email);
       if (user) {
         throw new BadRequestException('User already Exists');
       } else {
         //hashing new user password
         const pass = await this.passwordsService.hashPassword(data.password);
         //create new user account with hashed password
         //hashed password in pass
         data.password = pass;
         const result = await this.prisma.user.create({
           data: {
            firstName:data.firstName,
            lastName:data.lastName,
            email:data.email,
            password: data.password,
            jobProfile:data.jobProfile,
    location:data.location,
  bio:data.bio,
  status: data.Status,
  profileImage:null,
    confirmationCode: token,
           },
         });
         if(result){
          return result;
         }

       }

   }catch(error){
 throw new BadRequestException('Unable to create User',error);
   }


   async getUserFromEmail(email: string) {
    const result = await this.prisma.user.findFirst({
      where: {
        email: email,
      }
    });
    if (result) {
      console.log('resultttttt', result);

      return result;
    }
  }

  async verifyUserEmail(email){

    const result = await this.prisma.user.update({
      where: {
        email: email,
      },
      data:{
        status: 'Active',
      }
  })
if(result){
  return { message: "Email verified" };
}
else {
  throw new BadRequestException("Unable to verify Email");
}
}


async getUserFromId(_id) {
  try {
    const user = await this.prisma.user.findFirst({
      where:{id:_id}
    });
    return user;
  } catch (error) {
    console.log(`Error Occured, ${error}`);
  }
};

async getAll() {
  try {
    const user = await this.prisma.user.findMany();
    return user;
  } catch (error) {
    console.log(`Error Occured, ${error}`);
  }
};

async getUserFromConfirmationCode(confirmationCode)  {
  try {
    const user = await this.prisma.user.findFirst({
      where:{
        confirmationCode:confirmationCode,
      }
    });
    return user;
  } catch (error) {
    console.log(`Error Occured, ${error}`);
  }
};



 async updateUserProfile(_id, data) {
const result= await this.prisma.user.update({
  where:{id:_id},
  data:{
    firstName:data.firstName,
    lastName:data.lastName,
    email:data.email,
    password: data.password,
    jobProfile:data.jobProfile,
location:data.location,
bio:data.bio,
status: data.Status,
profileImage:data.profileImage,
confirmationCode: data.confirmationCode,
  }
});
if(result){
  return { message: "Update Successfully" } ;
}
else{
  return { message: "Something went wrong" };
}

  }

  async delete(_id,) {
    const result= await this.prisma.user.delete({
      where:{id:_id},
    });
    if(result){
      return { message: "deleted Successfully" } ;
    }
    else{
      return { message: "Something went wrong" };
    }

      }


  async validateUser(email: string, pass: string) {

    try {
      const user1 = await this.prisma.user.findFirst({
        where: { email: email },
      });
      if (!user1) {
        throw new UnauthorizedException('Email/password incorrect');
      }
      else if (user1.status === "Pending") {
        throw new UnauthorizedException({message:"Pending Account. Please Verify Your Email!"})
      }
      else if (user1.status !== "Active") {
        throw new UnauthorizedException({message:"Unauthorized!"})
      }
      else{
      const isMatch = await this.passwordsService.comparePassword(
        pass,
        user1.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Email/password incorrect');
      } else {
        const { password, ...user } = user1;
        console.log("user",user);


        return user;
      }
  }  } catch (ex) {
      throw ex;
    }

  }
}