import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoService } from 'src/core/crypto/crypto.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [PrismaModule, CoreModule],
  providers: [UsersService, CryptoService, Logger],
  controllers: [UsersController],
})
export class UsersModule {}
