import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';
import { ImgData } from 'src/types/image.data';
import { SignUser, User } from './entities/user.interface';

const select = {
  id: true,
  username: true,
  email: true,
  role: true,
  clubs: {
    select: {
      name: true,
      country: true,
    },
  },
  avatar: {
    select: {
      publicId: true,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectFull = {
  username: true,
  email: true,
  birthday: true,
  clubs: {
    select: {
      name: true,
      country: true,
    },
  },
  avatar: {
    select: {
      publicId: true,
      folder: true,
      fieldName: true,
      originalName: true,
      secureUrl: true,
      resourceType: true,
      mimetype: true,
      format: true,
      height: true,
      width: true,
      bytes: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany({ select });
  }

  async findOneUser(id: string) {
    const data = this.prismaService.user.findUnique({ where: { id } });
    if (!data) {
      throw await new NotFoundException(`User ${id} not founded`);
    }
    return data;
  }

  async createUser(data: CreateUserDto) {
    return this.prismaService.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto, imgData: ImgData | null) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: {
          ...data,
          avatar: imgData
            ? {
                upsert: {
                  create: imgData,
                  update: imgData,
                },
              }
            : {},
        },
        select,
      });
    } catch (error) {
      throw await new NotFoundException(`User ${id} not found`);
    }
  }

  async deleteUser(id: string) {
    try {
      const deleteAvatar = this.prismaService.avatar.delete({
        where: { userId: id },
      });
      const deleteUser = this.prismaService.user.delete({
        where: { id },
        select,
      });
      const transaction = await this.prismaService.$transaction([
        deleteAvatar,
        deleteUser,
      ]);
      return transaction[1];
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async findForLogin(email: string): Promise<SignUser | null> {
    const result = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
      },
    });

    return result;
  }
}
