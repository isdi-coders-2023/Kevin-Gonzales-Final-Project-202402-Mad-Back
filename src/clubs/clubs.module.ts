import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { LoggedGuard } from '../core/auth/logged.guard';
import { CryptoService } from '../core/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [PrismaModule, CoreModule],
  providers: [ClubsService, LoggedGuard, CryptoService, JwtService],
  controllers: [ClubsController],
})
export class ClubsModule {}
