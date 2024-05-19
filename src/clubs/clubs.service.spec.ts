import { Test, TestingModule } from '@nestjs/testing';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './entities/club.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoggedGuard } from '../core/auth/logged.guard';
import { NotFoundException } from '@nestjs/common';
import { ImgData } from 'src/types/image.data';

const mockPrismaService = {
  club: {
    findMany: jest.fn(() => []),
    findUnique: jest.fn(() => ({})),
    create: jest.fn(() => ({})),
    update: jest.fn(() => ({})),
    delete: jest.fn(() => ({})),
  },
  logo: {
    create: jest.fn(() => ({})),
    delete: jest.fn(() => ({})),
  },
  $transaction: jest.fn(() => ({})),
};

describe('ClubsService', () => {
  let service: ClubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ClubsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideGuard(LoggedGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    service = module.get<ClubsService>(ClubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClubs', () => {
    it('should return an array of clubs', async () => {
      const clubs = await service.getClubs();
      expect(clubs).toEqual([]);
    });
  });

  describe('getOneClub', () => {
    it('should return a club', async () => {
      const club = await service.getOneClub('1');
      expect(club).toEqual({});
    });
  });

  describe('createClub', () => {
    describe('when we create a club', () => {
      it('without logo', async () => {
        const club = await service.createClub({} as CreateClubDto, null);
        expect(club).toEqual({});
      });
      it('with logo', async () => {
        const club = await service.createClub(
          {} as CreateClubDto,
          {} as ImgData,
        );
        expect(club).toEqual({});
      });
    });
  });

  describe('updateClub', () => {
    describe('when we update a club', () => {
      it('without logo', async () => {
        const club = await service.updateClub('1', {} as CreateClubDto, null);
        expect(club).toEqual({});
      });
      it('with logo', async () => {
        const club = await service.updateClub(
          '1',
          {} as CreateClubDto,
          {} as ImgData,
        );
        expect(club).toEqual({});
      });
    });
  });

  describe('deleteClub', () => {
    const errasedClub = { id: '1' };
    it('should delete a club', async () => {
      await service.deleteClub(errasedClub.id);
      expect(mockPrismaService.club.delete).toHaveBeenCalled();
    });
    it('should return a error if club not found', async () => {
      mockPrismaService.club.findUnique = jest.fn(() => null);
      await expect(service.deleteClub(errasedClub.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
