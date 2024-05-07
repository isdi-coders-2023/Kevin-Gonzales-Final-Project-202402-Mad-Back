import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService, TokenPayload } from './crypto.service';
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
        { provide: Logger, useValue: { log: jest.fn() } },
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
  describe('When we use createToken method', () => {
    it('should create a token', async () => {
      const fakePayload: TokenPayload = { id: 'id', role: 'role' };
      const fakeToken = await mockJwtService.signAsync(fakePayload as SignUser);
      expect(fakeToken).toBeTruthy();
    });

    it('should return a error with invalid payload', async () => {
      const fakePayload = { id: 'id' };
      expect(service.createToken(fakePayload as SignUser)).rejects.toThrow();
    });

    it('should return a error with invalid secret', async () => {
      const fakePayload = { id: 'id', role: 'role' };
      mockConfigService.get = jest.fn().mockRejectedValue(new Error('Error'));
      expect(service.createToken(fakePayload as SignUser)).rejects.toThrow();
    });
  });

  describe('When we use verifyToken method', () => {
    it('should verify a token', async () => {
      const result = await mockJwtService.verifyAsync<TokenPayload>('token', {
        secret: 'SECRET_JWT',
      });
      expect(result).toEqual({});
    });
  });
});
