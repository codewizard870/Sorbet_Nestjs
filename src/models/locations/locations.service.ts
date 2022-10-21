import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prismaService:PrismaService){}
 async create(data: CreateLocationDto) {
    const result= await this.prismaService.location.create({
      data:{
        eventId: data.eventId,
          
        gigId: data.gigId,

        location_type: data.location_type,

        Latitude :data.Latitude,
        
        Langitude :data.Langitude,

      }
    }
  )
if(result){
  return result;
}
  }

  findAll() {
    return `This action returns all locations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
