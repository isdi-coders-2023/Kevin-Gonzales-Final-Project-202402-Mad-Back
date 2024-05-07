import { ExecutionContext, Logger } from '@nestjs/common';
import { LogGuard } from './log.guard';

describe('LoggedGuard', () => {
  const logger = new Logger();
  const logGuard = new LogGuard(logger);
  it('should be defined', () => {
    expect(LogGuard).toBeDefined();
  });
  describe('canActivate', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: '',
          params: { id: 'item_1234' },
        }),
      }),
      getClass: () => 'class',
    } as unknown as ExecutionContext;
    jest.spyOn(logger, 'log');
    it('should return true', () => {
      const result = logGuard.canActivate(context);
      expect(logger.log).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
