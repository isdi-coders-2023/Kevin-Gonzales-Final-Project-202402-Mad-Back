import { TestingModule, Test } from '@nestjs/testing';
import { CryptoService } from '../core/crypto/crypto.service';
import { FilesService } from '../core/files/files.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Logger } from '@nestjs/common';
import { LoggedGuard } from '../core/auth/logged/logged.guard';

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
});
