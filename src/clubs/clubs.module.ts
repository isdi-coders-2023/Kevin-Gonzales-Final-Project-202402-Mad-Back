import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';

@Module({
  imports: [PrismaModule, CoreModule],
  providers: [ClubsService],
  controllers: [ClubsController],
})
export class ClubsModule {}
