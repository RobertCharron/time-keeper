import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityUseDto } from './dto/create-activity-use.dto';
import { UpdateActivityUseDto } from './dto/update-activity-use.dto';

@Injectable()
export class ActivityUseService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityUseDto: CreateActivityUseDto) {
    return this.prisma.activityUse.create({
      data: createActivityUseDto,
    });
  }

  async findAll() {
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

  async findOne(id: string) {
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

  async update(id: string, updateActivityUseDto: UpdateActivityUseDto) {
    return this.prisma.activityUse.update({
      where: { id },
      data: updateActivityUseDto,
    });
  }

  async remove(id: string) {
    return this.prisma.activityUse.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
