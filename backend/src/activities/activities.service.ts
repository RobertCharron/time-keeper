import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: createActivityDto,
    });
  }

  async findAll() {
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

  async findOne(id: string) {
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

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    return this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
  }

  async remove(id: string) {
    return this.prisma.activity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
