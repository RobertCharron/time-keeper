import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserWithPassword,
  UserWithoutPassword,
  userSelect,
  userWithoutPasswordSelect,
} from './types/user.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'generated/prisma';
import { HashingService } from '../auth/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

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
      const isValid = await this.hashingService.comparePassword(
        password,
        user.hashedPassword,
      );
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
      const hashedPassword = await this.hashingService.hashPassword(password);

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
      console.warn('Error creating user', err);
      throw new ConflictException('Could not create user');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashingService.hashPassword(
      createUserDto.password,
    );

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.hashedPassword = await this.hashingService.hashPassword(
        updateUserDto.password,
      );
      delete updateUserDto.password;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
