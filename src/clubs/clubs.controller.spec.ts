import { Test, TestingModule } from '@nestjs/testing';
import { ClubsController } from './clubs.controller';
import { CryptoService } from '../core/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClubsService } from './clubs.service';
import { FilesService } from '../core/files/files.service';
import { UpdateClubDto } from './entities/club.dto';

const mockGuard = {};

const mockClubService = {
  getClubs: jest.fn().mockResolvedValue([]),
  getOneClub: jest.fn().mockResolvedValue([]),
  createClub: jest.fn().mockResolvedValue([]),
  updateClub: jest.fn().mockResolvedValue([]),
  deleteClub: jest.fn().mockResolvedValue([]),
};

const mockFileService = {
  uploadImage: jest.fn().mockResolvedValue([]),
};

describe('ClubsController', () => {
  let controller: ClubsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubsController],
      providers: [
        { provide: ClubsService, useValue: mockClubService },
        { provide: FilesService, useValue: mockFileService },
        CryptoService,
        JwtService,
        ConfigService,
        FilesService,
      ],
      imports: [],
    })
      .overrideGuard(mockGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ClubsController>(ClubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clubs', async () => {
      const clubs = await controller.findAll();
      expect(clubs).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a club', async () => {
      const club = await controller.findOne('1');
      expect(club).toEqual([]);
    });
  });

  describe('update', () => {
    describe('should update a club', () => {
      it('without logo', async () => {
        const club = await controller.update('1', {} as UpdateClubDto, null);
        expect(club).toEqual([]);
      });
    });
  });

  describe('create', () => {
    it('should create a club', async () => {
      const club = await controller.create({} as UpdateClubDto, null);
      expect(club).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete a club', async () => {
      const club = await controller.delete('1');
      expect(club).toEqual([]);
    });
  });
});
