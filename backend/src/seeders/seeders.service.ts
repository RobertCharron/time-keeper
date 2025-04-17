import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedersService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    try {
      // Clear existing data
      await this.prisma.activityUse.deleteMany();
      await this.prisma.activity.deleteMany();
      await this.prisma.station.deleteMany();
      await this.prisma.user.deleteMany();

      // Seed stations
      const stations = await this.prisma.station.createMany({
        data: [
          { name: 'Main Station' },
          { name: 'Secondary Station' },
          { name: 'Training Station' },
        ],
      });

      // Get all stations
      const allStations = await this.prisma.station.findMany();

      // Seed activities for each station
      for (const station of allStations) {
        await this.prisma.activity.createMany({
          data: [
            { name: 'Activity 1', stationId: station.id },
            { name: 'Activity 2', stationId: station.id },
            { name: 'Activity 3', stationId: station.id },
          ],
        });
      }

      // Get all activities
      const allActivities = await this.prisma.activity.findMany();

      // Seed users
      const users = await this.prisma.user.createMany({
        data: [
          {
            name: 'Admin User',
            email: 'admin@example.com',
            hashedPassword: 'hashed_password_here', // In production, use proper password hashing
          },
          {
            name: 'Regular User',
            email: 'user@example.com',
            hashedPassword: 'hashed_password_here',
          },
        ],
      });

      // Seed activity uses
      for (const activity of allActivities) {
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 3600000); // 1 hour later

        await this.prisma.activityUse.createMany({
          data: [
            {
              startTime,
              endTime,
              activityId: activity.id,
            },
          ],
        });
      }

      return {
        message: 'Database seeded successfully',
        stations: stations.count,
        users: users.count,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to seed database: ${error.message}`);
    }
  }
}
