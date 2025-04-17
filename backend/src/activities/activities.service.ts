import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from 'generated/prisma';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.prisma.activity.create({
      data: createActivityDto,
    });
  }

  async findAll(): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        station: true,
        activityUses: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Activity | null> {
    return this.prisma.activity.findUnique({
      where: { id },
      include: {
        station: true,
        activityUses: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    return this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
  }

  async remove(id: string): Promise<Activity> {
    return this.prisma.activity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
