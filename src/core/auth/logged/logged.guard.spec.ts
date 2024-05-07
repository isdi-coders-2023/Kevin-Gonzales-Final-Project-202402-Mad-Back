import { ExecutionContext, Logger } from '@nestjs/common';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { LoggedGuard } from './logged.guard';

const cryptoServiceMock: CryptoService = {
  verifyToken: jest.fn().mockResolvedValue({}),
} as unknown as CryptoService;

const mockLogger: Logger = {
  log: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger;

describe('LoggedGuard', () => {
  const loggedGuard = new LoggedGuard(mockLogger, cryptoServiceMock);
  it('should be defined', () => {
    expect(loggedGuard).toBeDefined();
  });

  describe('When we call canActivate method', () => {
    it('should return true', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer token',
            },
          }),
        }),
      } as unknown as ExecutionContext;
      const result = await loggedGuard.canActivate(context);
      expect(result).toBe(true);
    });
  });
  describe('And there are NOT Authorization header', () => {
    it('should throw BadRequestException', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;
      try {
        await loggedGuard.canActivate(context);
      } catch (error) {
        expect(error.message).toBe('Authorization header is required');
      }
    });
  });

  describe('And token is invalid', () => {
    it('should throw ForbiddenException', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer token',
            },
          }),
        }),
      } as ExecutionContext;
      cryptoServiceMock.verifyToken = jest.fn().mockRejectedValue(new Error());
      try {
        await loggedGuard.canActivate(context);
      } catch (error) {
        expect(error.message).toBe('Invalid token');
      }
    });
  });
});
