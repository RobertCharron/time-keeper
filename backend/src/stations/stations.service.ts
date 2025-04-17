import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationsService {
  constructor(private prisma: PrismaService) {}

  async create(createStationDto: CreateStationDto) {
    return this.prisma.station.create({
      data: createStationDto,
    });
  }

  async findAll() {
    return this.prisma.station.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        activities: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.station.findUnique({
      where: { id },
      include: {
        activities: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async update(id: string, updateStationDto: UpdateStationDto) {
    return this.prisma.station.update({
      where: { id },
      data: updateStationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.station.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
