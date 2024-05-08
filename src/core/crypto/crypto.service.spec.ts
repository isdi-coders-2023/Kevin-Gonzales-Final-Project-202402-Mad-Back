import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { SignUser } from 'src/users/entities/user.interface';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedValue'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockConfigService: ConfigService = {
  get: jest.fn().mockReturnValue('SECRET_JWT'),
} as unknown as ConfigService;

const mockJwtService: JwtService = {
  signAsync: jest.fn().mockResolvedValue('token'),
  verifyAsync: jest.fn().mockResolvedValue({}),
} as unknown as JwtService;

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        CryptoService,
        Logger,
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('When we use hash method', () => {
    it('should hash a value', async () => {
      const value = 'test';
      const result = await service.hash(value);
      expect(result).toEqual('hashedValue');
    });
  });

  describe('When we use compare method', () => {
    it('should compare a value with a hash', async () => {
      const value = 'test';
      const hash = 'hashedValue';
      const result = await service.compare(value, hash);
      expect(result).toBe(true);
    });
  });

  describe('When we call createToken method', () => {
    it('should return a token', async () => {
      const user = { id: '1', role: 'admin' } as SignUser;
      const result = await service.createToken(user);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { id: '1', role: 'admin' },
        { secret: 'SECRET_JWT' },
      );
      expect(result).toBe('token');
    });
  });

  describe('When we call verifyToken method', () => {
    it('should return a verificated token', async () => {
      const token = 'token';
      const result = await service.verifyToken(token);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'SECRET_JWT',
      });
      expect(result).toEqual({});
    });
  });
});
