import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger, NotFoundException } from '@nestjs/common';

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

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await service.findAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe('findOneUser', () => {
    it('should return a user', async () => {
      const result = await service.findOneUser('1');
      expect(result).toEqual({});
    });
    it('should throw an error if user not found', async () => {
      mockPrismaService.user.findUnique.mockReturnValue(null);
      await expect(service.findOneUser('1')).rejects.toThrow();
    });
  });

  describe('createUser', () => {
    it('should return a new user', async () => {
      const result = await service.createUser({
        username: '',
        email: '',
        password: '',
      });
      expect(result).toEqual({});
    });
    it('should throw an error if user not created', async () => {
      mockPrismaService.user.create.mockRejectedValue(
        new NotFoundException(`Data invalid. Try again.`),
      );
      await expect(
        service.createUser({
          username: '',
          email: '',
          password: '',
        }),
      ).rejects.toThrow(new NotFoundException(`Data invalid. Try again.`));
    });
  });

  describe('updateUser', () => {
    it('should return an updated user', async () => {
      const result = await service.updateUser(
        '1',
        {
          username: '',
          email: '',
          password: '',
          role: 'user',
        },
        null,
      );
      expect(result).toEqual({});
    });
    it('should throw an error if user not found', async () => {
      mockPrismaService.user.update.mockRejectedValue(new Error());
      await expect(
        service.updateUser(
          '1',
          {
            username: '',
            email: '',
            password: '',
            role: 'user',
          },
          null,
        ),
      ).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete user with avatar', async () => {
      const user = { id: 'some-id', avatar: 'avatar-id' };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      await service.deleteUser(user.id);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(mockPrismaService.avatar.delete).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.avatar.delete.mock.results[0].value,
        mockPrismaService.user.delete.mock.results[0].value,
      ]);
    });
    it('should delete user with null avatar', async () => {
      const user = { id: 'some-id', avatar: null };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      expect(await service.deleteUser(user.id)).toEqual({});
    });

    it('should delete user with undefined avatar', async () => {
      const user = { id: 'some-id', avatar: undefined };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      expect(await service.deleteUser(user.id)).toEqual({});
    });

    it('should throw an error if user not found', async () => {
      mockPrismaService.user.findUnique.mockReturnValue(null);
      await expect(service.deleteUser('1')).rejects.toThrow();
    });
  });

  describe('findForLogin', () => {
    it('should return a user for login', async () => {
      const searchUser = { email: 'email', username: 'username' };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue({
        searchUser,
      });

      await service.findForLogin(searchUser.email, searchUser.username);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: searchUser,
        select: {
          id: true,
          password: true,
          role: true,
        },
      });
    });
  });
});
