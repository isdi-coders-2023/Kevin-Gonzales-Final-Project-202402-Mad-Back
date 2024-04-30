import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAllUsers() {
    return this.prismaService.user.findMany();
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

  async updateUser(data: UpdateUserDto, id: string) {
    try {
      return this.prismaService.user.update({ where: { id }, data });
    } catch (error) {
      throw await new NotFoundException(`Invalid Data`);
    }
  }

  async deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
