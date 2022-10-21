import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordsService } from 'src/passwords/passwords.service';
import { TokensService } from 'src/tokens/tokens.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordsService,PrismaService,TokensService]
})
export class UsersModule {}
