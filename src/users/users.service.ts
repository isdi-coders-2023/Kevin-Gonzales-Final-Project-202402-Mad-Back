import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
} from './entities/user.dto';
import { ImgData } from 'src/types/image.data';
import { SignUser, User } from './entities/user.interface';

const select = {
  id: true,
  username: true,
  email: true,
  role: true,
  country: true,
  clubs: {
    select: {
      name: true,
      country: true,
    },
  },
  avatar: {
    select: {
      publicId: true,
      secureUrl: true,
    },
  },
};

const selectFull = {
  id: true,
  username: true,
  email: true,
  role: true,
  country: true,
  clubs: {
    select: {
      name: true,
      country: true,
    },
  },
  avatar: {
    select: {
      publicId: true,
      secureUrl: true,
      width: true,
      height: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany({ select });
  }

  async findOneUser(id: string): Promise<User> {
    try {
      return this.prismaService.user.findUnique({
        where: { id },
        select: selectFull,
      });
    } catch (error) {
      throw new NotFoundException(`User ${id} not founded`);
    }
  }

  async filterUsers(data: FilterUserDto): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: { ...data },
      select,
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return this.prismaService.user.create({ data }) as unknown as User;
    } catch (error) {
      throw await new NotFoundException(`Data invalid. Try again.`);
    }
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
    imgData: ImgData | null,
  ): Promise<User> {
    // const userUpdate = await this.prismaService.user.findUnique({
    //   where: { id },
    //   select: {
    //     avatar: {
    //       select: {
    //         publicId: true,
    //       },
    //     },
    //   },
    // });

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
    const errasedUser = await this.prismaService.user.findUnique({
      where: { id },
      select,
    });
    if (!errasedUser) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (errasedUser.avatar === null) {
      return await this.prismaService.user.delete({ where: { id } });
    }
    const deleteAvatar = this.prismaService.avatar.delete({
      where: { userId: id },
    });
    const deleteUser = this.prismaService.user.delete({ where: { id } });

    return await this.prismaService.$transaction([deleteAvatar, deleteUser]);
  }

  async findForLogin(email: string, username: string): Promise<SignUser> {
    const result = await this.prismaService.user.findUnique({
      where: { email, username },
      select: {
        id: true,
        password: true,
        role: true,
      },
    });

    return result;
  }
}
