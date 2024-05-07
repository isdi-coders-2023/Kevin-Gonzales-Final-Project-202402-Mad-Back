import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClubsModule } from './clubs/clubs.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ClubsModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
