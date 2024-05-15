import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClubDto } from './entities/club.dto';
import { Club } from './entities/club.interface';
import { ImgData } from 'src/types/image.data';

const select = {
  id: true,
  name: true,
  country: true,
  founded: true,
  state: true,
  description: true,
  logo: {
    select: {
      publicId: true,
    },
  },
  fans: {
    select: {
      username: true,
    },
  },
};

const selectfull = {
  id: true,
  name: true,
  country: true,
  founded: true,
  state: true,
  description: true,
  logo: {
    select: {
      publicId: true,
      secureUrl: true,
      width: true,
      height: true,
    },
  },
  fans: {
    select: {
      username: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class ClubsService {
  constructor(private prismaService: PrismaService) {}

  async getClubs(): Promise<Club[]> {
    return await this.prismaService.club.findMany({ select });
  }

  async getOneClub(id: string): Promise<Club> {
    return this.prismaService.club.findUnique({
      where: {
        id,
      },
      select: selectfull,
    });
  }

  async createClub(
    data: CreateClubDto,
    imgData: ImgData | null,
  ): Promise<Partial<Club>> {
    return this.prismaService.club.create({
      data: {
        ...data,
        logo: imgData ? { create: imgData } : {},
      },
      select,
    });
  }

  async updateClub(
    id: string,
    data: CreateClubDto,
    imgData: ImgData | null,
  ): Promise<Club> {
    return this.prismaService.club.update({
      where: {
        id,
      },
      data: {
        ...data,
        logo: imgData
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
  }

  async deleteClub(id: string) {
    const errasedClub = await this.prismaService.club.findUnique({
      where: { id },
      select,
    });

    if (!errasedClub) {
      throw new NotFoundException(`Club ${id} not found`);
    }

    const deleteLogo = this.prismaService.logo.delete({
      where: {
        clubId: errasedClub.id,
      },
    });

    const deleteClub = this.prismaService.club.delete({
      where: {
        id,
      },
    });

    return await this.prismaService.$transaction([deleteLogo, deleteClub]);
  }
}
