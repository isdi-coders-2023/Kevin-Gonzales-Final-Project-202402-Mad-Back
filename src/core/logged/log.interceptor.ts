import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { originalUrl, method } = req;
    this.logger.log(
      `Request URL: [${method.toUpperCase()}] ${originalUrl}`,
      `LogInterceptor: ${context.getClass().name}`,
    );
    return next.handle();
  }
}
