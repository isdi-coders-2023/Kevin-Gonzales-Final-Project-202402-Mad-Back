import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from './crypto/crypto.service';
import { FilesService } from './files/files.service';

@Module({
  imports: [JwtModule],
  providers: [CryptoService, Logger, FilesService],
  exports: [CryptoService, FilesService],
})
export class CoreModule {}
