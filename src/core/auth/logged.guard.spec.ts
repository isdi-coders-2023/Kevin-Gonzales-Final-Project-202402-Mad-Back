import { ExecutionContext } from '@nestjs/common';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { LoggedGuard } from './logged.guard';

const cryptoServiceMock: CryptoService = {
  verifyToken: jest.fn().mockResolvedValue({}),
} as unknown as CryptoService;

describe('LoggedGuard', () => {
  const loggedGuard = new LoggedGuard(cryptoServiceMock);
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
