import { Module } from '@nestjs/common';
import { ActivityUseService } from './activity-use.service';
import { ActivityUseController } from './activity-use.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ActivityUseController],
  providers: [ActivityUseService, PrismaService],
  exports: [ActivityUseService],
})
export class ActivityUseModule {}
