import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeedersService } from './seeders.service';
import { HashingService } from '../auth/hashing.service';

@Module({
  providers: [SeedersService, PrismaService, HashingService],
  exports: [SeedersService],
})
export class SeedersModule {}
