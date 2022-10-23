import { Injectable } from '@nestjs/common';
import { TimezonesService } from 'src/timezones/timezones.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prismaService:PrismaService,private timezonesService:TimezonesService){}
 async create(data: CreateEventDto) {
  const utcStartDate=this.timezonesService.convertToUtc(data.start_date);
    const utcEndDate=this.timezonesService.convertToUtc(data.end_date);
      
  const result= await this.prismaService.event.create({
      data:{
        postId : data.postId,

        event_image: data.event_image,

        start_date:  utcStartDate,
        end_date:  utcEndDate,

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

  async findAll() {
    return await this.prismaService.event.findMany();
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
