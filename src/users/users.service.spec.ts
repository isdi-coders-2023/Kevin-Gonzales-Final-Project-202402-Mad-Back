import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';
import { ImgData } from 'src/types/image.data';

const mockPrismaService = {
  user: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockReturnValue({}),
    create: jest.fn().mockReturnValue({}),
    update: jest.fn().mockReturnValue({}),
    delete: jest.fn().mockReturnValue({}),
  },
  avatar: {
    delete: jest.fn().mockReturnValue({}),
  },
  $transaction: jest.fn().mockResolvedValue([{}, {}]),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        UsersService,
        Logger,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we use the method findAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.findAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method findOneUser', () => {
    it('should return a user', async () => {
      const result = await service.findOneUser('1');
      expect(result).toEqual({});
    });

    it('should throw an error if the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockReturnValueOnce(null);
      expect(service.findOneUser('1')).rejects.toThrow('User 1 not found');
    });
  });

  describe('When we use the method createUser', () => {
    it('should return a new user', async () => {
      const result = await service.createUser({} as CreateUserDto);
      expect(result).toEqual({});
    });
  });

  describe('When we use the method updateUser', () => {
    it('should return an updated user', async () => {
      const result = await service.updateUser('1', {} as UpdateUserDto, null);
      expect(result).toEqual({});
    });

    it('should throw an error if the user does not exist', async () => {
      mockPrismaService.user.update.mockRejectedValueOnce(new Error());
      expect(
        service.updateUser('1', {} as CreateUserDto, null),
      ).rejects.toThrow('User 1 not found');
    });

    it('should return an updated user with an image', async () => {
      const result = await service.updateUser(
        '1',
        {} as UpdateUserDto,
        {} as ImgData,
      );
      expect(result).toEqual({});
    });

    describe('When we use the method deleteUser', () => {
      it('should return a deleted user', async () => {
        const result = await service.deleteUser('1');
        expect(result).toEqual({});
      });
      it('Then it should throw an error if the user is not found', async () => {
        mockPrismaService.$transaction.mockRejectedValueOnce(new Error());
        expect(service.deleteUser('1')).rejects.toThrow('User 1 not found');
      });
    });

    describe('When we use the method findForLogin', () => {
      it('should return a user', async () => {
        const result = await service.findForLogin('');
        expect(result).toEqual({});
      });
    });
  });
});
