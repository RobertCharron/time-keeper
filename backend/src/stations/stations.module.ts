import { Module } from '@nestjs/common';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StationsController],
  providers: [StationsService, PrismaService],
  exports: [StationsService],
})
export class StationsModule {}
