import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl, method } = req;
    const reqTime = new Date().getTime();
    this.logger.log(
      `Request URL: [${method.toUpperCase()}] ${originalUrl}`,
      'LogMiddleware',
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();
      const duration = resTime - reqTime;
      this.logger.log(
        `Response URL: [${method.toUpperCase()}] ${originalUrl} => status ${statusCode} - ${duration}ms`,
        'LogMiddleware',
      );
    });

    next();
  }
}
