import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prismaService:PrismaService){}
 async create(data: CreateEventDto) {
    const result= await this.prismaService.event.create({
      data:{
        postId : data.postId,

        event_image: data.event_image,

        start_date:  data.start_date,
        end_date:  data.end_date,

        event_link :data.event_link,
description :data.description,
 timezone :data.timezone
      }
    }
  )
if(result){
  return result;
}
 
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
