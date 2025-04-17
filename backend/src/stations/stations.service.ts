import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from 'generated/prisma';

@Injectable()
export class StationsService {
  constructor(private prisma: PrismaService) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    return this.prisma.station.create({
      data: createStationDto,
    });
  }

  async findAll(): Promise<Station[]> {
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

  async findOne(id: string): Promise<Station | null> {
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

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    return this.prisma.station.update({
      where: { id },
      data: updateStationDto,
    });
  }

  async remove(id: string): Promise<Station> {
    return this.prisma.station.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
