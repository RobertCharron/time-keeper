import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../auth/hashing.service';

@Module({
  providers: [UsersService, PrismaService, HashingService],
  exports: [UsersService],
})
export class UsersModule {}
