import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityUseDto } from './dto/create-activity-use.dto';
import { UpdateActivityUseDto } from './dto/update-activity-use.dto';
import { ActivityUse } from 'generated/prisma';

@Injectable()
export class ActivityUseService {
  constructor(private prisma: PrismaService) {}

  async create(
    createActivityUseDto: CreateActivityUseDto,
  ): Promise<ActivityUse> {
    return this.prisma.activityUse.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: createActivityUseDto,
    });
  }

  async findAll(): Promise<ActivityUse[]> {
    return this.prisma.activityUse.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        activity: {
          include: {
            station: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<ActivityUse | null> {
    return this.prisma.activityUse.findUnique({
      where: { id },
      include: {
        activity: {
          include: {
            station: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateActivityUseDto: UpdateActivityUseDto,
  ): Promise<ActivityUse> {
    return this.prisma.activityUse.update({
      where: { id },
      data: updateActivityUseDto,
    });
  }

  async remove(id: string): Promise<ActivityUse> {
    return this.prisma.activityUse.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
