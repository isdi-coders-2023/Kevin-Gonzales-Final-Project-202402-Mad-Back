import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';

const mockPrismaService = {
  user: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
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
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we use the method findAllUsers', () => {
    it('Then it should return all users', async () => {
      const result = await service.findAllUsers();
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method findOneUser', () => {
    it('Then it should return one user with correct ID', async () => {
      const result = await service.findOneUser('1');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalled();
      expect(result).toEqual({});
    });
    it('Then should return a error with not founded ID', async () => {
      mockPrismaService.user.findUnique.mockReturnValueOnce(null);
      expect(service.findOneUser('1')).rejects.toThrow('User 1 not found');
    });
  });

  describe('When we use the method createUser', () => {
    it('Then it should return a new User', async () => {
      const fakeData: CreateUserDto = {} as CreateUserDto;
      const result = await service.createUser(fakeData);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method updateUser', () => {
    it('Then it should return a user edited', async () => {
      const fakeData: UpdateUserDto = {} as UpdateUserDto;
      const result = await service.updateUser(fakeData, '1');
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
    it('Then it should return a error with invalid data', () => {
      const fakeData: UpdateUserDto = {} as UpdateUserDto;
      expect(service.updateUser(fakeData, '1')).rejects.toThrow('Invalid Data');
    });
  });
});
