import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PasswordsService } from 'src/utils/passwords/passwords.service';
import { TokensService } from 'src/utils/tokens/tokens.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordsService,PrismaService,TokensService]
})
export class UsersModule {}
