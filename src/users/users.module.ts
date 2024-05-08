import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [PrismaModule, CoreModule],
  providers: [UsersService, Logger],
  controllers: [UsersController],
})
export class UsersModule {}
