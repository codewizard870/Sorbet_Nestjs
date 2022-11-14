import { Injectable } from '@nestjs/common';
import { PrismaService } from './utils/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService:PrismaService){}
  getHello(): string {
    return 'Hello World!';
  }

 async resetDatabase(){
    await this.prismaService.gig.deleteMany();
    await this.prismaService.user.deleteMany();
    return {message:'database reseted successfully'}
  }
}
