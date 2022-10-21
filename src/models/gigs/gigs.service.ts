import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';

@Injectable()
export class GigsService {
  
  constructor(private prismaService:PrismaService,){}
  
   async create(data: CreateGigDto) {
    const result= await this.prismaService.gig.create({
      data:{
        
        postId :data.postId,
        start_date:  data.start_date,
        end_date:  data.end_date,
        title:data.title,
    description: data.description,
    gig_price_min:data.gig_price_min,
    gig_price_max:data.gig_price_max,
    tags:data.tags
      }
    }
  )
if(result){
  return result;
}
  
}
  
   

  findAll() {
    return `This action returns all gigs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gig`;
  }

  update(id: number, updateGigDto: UpdateGigDto) {
    return `This action updates a #${id} gig`;
  }

  remove(id: number) {
    return `This action removes a #${id} gig`;
  }
}
