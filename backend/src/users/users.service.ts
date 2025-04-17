import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  UserWithPassword,
  UserWithoutPassword,
  userSelect,
  userWithoutPasswordSelect,
} from './types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPassword | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });

    return result as UserWithPassword | null;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user) return null;

    try {
      const isValid = await bcrypt.compare(password, user.hashedPassword);
      if (!isValid) return null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword: _, ...result } = user;
      return result;
    } catch {
      return null;
    }
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const existingUser = await this.findByEmailWithPassword(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
        select: userWithoutPasswordSelect,
      });

      return user;
    } catch (err) {
      console.warn('Error creating user', err.message);
      throw new ConflictException('Could not create user');
    }
  }
}
