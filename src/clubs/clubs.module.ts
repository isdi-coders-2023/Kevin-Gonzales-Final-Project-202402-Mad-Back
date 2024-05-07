import { Logger, Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';

export type RepoFindId = {
  findById(id: string): Promise<any>;
};

export const REPO_SERVICE = 'REPO_SERVICE';

@Module({
  imports: [PrismaModule, CoreModule],
  providers: [
    {
      provide: 'REPO_SERVICE',
      useClass: ClubsService,
    },
    Logger,
    ClubsService,
  ],
  controllers: [ClubsController],
})
export class ClubsModule {}
