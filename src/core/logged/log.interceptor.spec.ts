import { ExecutionContext, Logger } from '@nestjs/common';
import { LogInterceptor } from './log.interceptor';

describe('LoggedInterceptor', () => {
  const logger = new Logger();
  const logInterceptor = new LogInterceptor(logger);
  it('should be defined', () => {
    expect(LogInterceptor).toBeDefined();
  });

  describe('intercept', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: '',
          params: { id: 'item_1234' },
        }),
      }),
      getClass: () => 'class',
    } as unknown as ExecutionContext;
    const next = {
      handle: jest.fn(),
    };
    jest.spyOn(logger, 'log');
    it('should return true', () => {
      logInterceptor.intercept(context, next);
      expect(logger.log).toHaveBeenCalled();
      expect(next.handle).toHaveBeenCalled();
    });
  });
});
