import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Injectable()
export class TokensService {
  constructor(private prismaService:PrismaService){}

  async getTokenByUserId (userId){
    try {
      const token = await this.prismaService.token.findFirst({
       where:{
        
        userId: userId
      } 
      })
        
      return token;
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  };

  async createTokenByUserId (_id,hash){
    try {
      const token = await this.prismaService.token.create({
       data:{
        token: hash,
        userId:_id,
      } 
      })
        
      return token;
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  };
  
  async deleteToken (id) {
    try {
      return await  this.prismaService.token.delete({
        where:{
        id:id,
      },
    }) 
    } catch (error) {
      console.log(`Error Occured, ${error}`);
    }
  };

  
}
