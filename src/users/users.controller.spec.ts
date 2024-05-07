import { TestingModule, Test } from '@nestjs/testing';
import { CryptoService } from '../core/crypto/crypto.service';
import { FilesService } from '../core/files/files.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ForbiddenException, Logger } from '@nestjs/common';
import { LoggedGuard } from '../core/auth/logged.guard';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';

const mockUsersService = {
  findAllUsers: jest.fn().mockResolvedValue([]),
  findOneUser: jest.fn().mockResolvedValue({}),
  createUser: jest.fn().mockResolvedValue({}),
  updateUser: jest.fn().mockResolvedValue({}),
  deleteUser: jest.fn().mockResolvedValue({}),
  findForLogin: jest.fn().mockResolvedValue({}),
};
const mockCryptoService = {
  hash: jest.fn().mockResolvedValue('12345hash'),
  compare: jest.fn().mockResolvedValue(true),
  createToken: jest.fn().mockResolvedValue('token'),
};

const mockFileService = {
  uploadImage: jest.fn().mockResolvedValue({}),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
        {
          provide: FilesService,
          useValue: mockFileService,
        },
        Logger,
      ],
    })
      .overrideGuard(LoggedGuard)
      .useValue(jest.fn().mockReturnValue(true))
      .compile();
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  describe('When we use findAll method', () => {
    it('should return all users', async () => {
      expect(await controller.findAll()).toEqual([]);
    });
  });

  describe('When we use findOne method', () => {
    it('should return one user', async () => {
      expect(await controller.findOne('1')).toEqual({});
    });
  });

  describe('When we use update method', () => {
    it('should return updated user without avatar', async () => {
      const data = {} as UpdateUserDto;
      expect(await controller.update('1', data, null)).toEqual({});
    });

    it('should return updated user with avatar', async () => {
      const data = {} as UpdateUserDto;
      const file = {} as Express.Multer.File;
      expect(await controller.update('1', data, file)).toEqual({});
    });

    it('should return error with invalid password', async () => {
      const data = { password: '123' } as UpdateUserDto;
      const file = {} as Express.Multer.File;
      mockCryptoService.compare.mockResolvedValue(false);
      try {
        await controller.update('1', data, file);
      } catch (e) {
        expect(e.message).toBe('Forbidden resource');
      }
    });
  });

  describe('When we use delete method', () => {
    it('should return deleted user', async () => {
      expect(await controller.delete('1')).toEqual({});
    });
  });

  describe('When we use create method', () => {
    it('should return created user', async () => {
      const fakeData = {} as unknown as CreateUserDto;
      expect(await controller.create(fakeData)).toEqual({});
    });
  });

  describe('When we use the method loginWithToken', () => {
    it('should return a token', async () => {
      const fakeData = { payload: { id: '1' } };
      expect(await controller.loginWithToken(fakeData)).toEqual({
        token: 'token',
      });
    });

    it('should return an error with invalid user', async () => {
      mockUsersService.findOneUser.mockResolvedValue(null);
      const fakeData = { payload: { id: '1' } };
      try {
        await controller.loginWithToken(fakeData);
      } catch (e) {
        expect(e.message).toBe('Email and password invalid');
      }
    });
  });

  describe('When we use the method login', () => {
    it('should return a token', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      mockCryptoService.compare.mockResolvedValue(true);
      const result = await controller.login(mockUserDto);
      expect(result).toEqual({ token: 'token' });
    });

    it('should return an error with invalid data', async () => {
      const mockUserDto = {
        email: '',
      } as CreateUserDto;
      mockCryptoService.compare.mockResolvedValue(false);
      const result = controller.login(mockUserDto);
      expect(result).rejects.toThrow('Email and password invalid');
    });

    it('should return an error with invalid user', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      (mockUsersService.findForLogin as jest.Mock).mockResolvedValueOnce(null);
      await expect(controller.login(mockUserDto)).rejects.toThrow(
        'Email and password invalid',
      );
    });

    it('should return an error when compare password', async () => {
      const mockUserDto = {
        email: '',
        password: '',
      } as CreateUserDto;
      (mockUsersService.findForLogin as jest.Mock).mockResolvedValueOnce(true);
      (mockCryptoService.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(controller.login(mockUserDto)).rejects.toThrow(
        new ForbiddenException('Email and password invalid'),
      );
    });
  });
});
