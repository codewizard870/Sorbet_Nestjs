import { Module } from '@nestjs/common';
import { GigsService } from './gigs.service';
import { GigsController } from './gigs.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Module({
  controllers: [GigsController],
  providers: [GigsService,PrismaService]
})
export class GigsModule {}
