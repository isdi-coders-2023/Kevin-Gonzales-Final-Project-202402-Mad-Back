import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CryptoService } from '../../../core/crypto/crypto.service';

@Injectable()
export class LoggedGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly cryptoService: CryptoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    if (!auth) {
      throw new BadRequestException('Authorization header is required');
    }
    const token = auth.split(' ')[1];
    try {
      request.payload = await this.cryptoService.verifyToken(token);
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid token');
    }
  }
}
