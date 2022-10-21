import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService,PrismaService]
})
export class LocationsModule {}
