import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { TimezonesService } from 'src/timezones/timezones.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService,PrismaService,TimezonesService]
})
export class EventsModule {}
