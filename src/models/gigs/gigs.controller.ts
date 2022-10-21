import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GigsService } from './gigs.service';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Gigs')
@Controller('/api/gigs')
export class GigsController {
  constructor(private readonly gigsService: GigsService) {}

  @Post()
 async create(@Body() createGigDto: CreateGigDto) {
    return await this.gigsService.create(createGigDto);
  }

  @Get()
  findAll() {
    return this.gigsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gigsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGigDto: UpdateGigDto) {
    return this.gigsService.update(+id, updateGigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gigsService.remove(+id);
  }
}
