import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeedersService } from './seeders.service';

@Module({
  providers: [SeedersService, PrismaService],
  exports: [SeedersService],
})
export class SeedersModule {}
