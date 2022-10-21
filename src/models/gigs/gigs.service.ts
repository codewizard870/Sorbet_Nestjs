import { Injectable } from '@nestjs/common';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';

@Injectable()
export class GigsService {
  create(createGigDto: CreateGigDto) {
    return 'This action adds a new gig';
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
