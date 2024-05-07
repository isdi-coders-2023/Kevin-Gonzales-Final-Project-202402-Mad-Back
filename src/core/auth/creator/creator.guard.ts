import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RepoFindId } from 'src/clubs/clubs.module';

@Injectable()
export class CreatorGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    @Inject('REPO_SERVICE') private repo: RepoFindId,
    private reflector: Reflector,
  ) {
    this.logger.debug('Instantiated', 'CreatorGuard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.payload) {
      throw new ForbiddenException('CreatorGuard No Payload');
    }
    // Get the user ID from the payload
    const userId = req.payload.id;
    // Get the item ID from the request
    const itemId = req.params.id;
    const item = await this.repo.findById(itemId);
    const ownerKey = this.reflector.get<string>(
      'ownerKey',
      context.getHandler(),
    );
    const creatorId = item[ownerKey].id;

    if (userId === creatorId) {
      return true;
    }

    return false;
  }
}
