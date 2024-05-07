import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { SignUser, User } from 'src/users/entities/user.interface';

export type TokenPayload = {
  id: string;
  role: string;
};

@Injectable()
export class CryptoService {
  private readonly jwtService: JwtService;
  private readonly configService: ConfigService;

  async hash(value: string) {
    return hash(value, 10);
  }

  async compare(value: string, hash: string) {
    return compare(value, hash);
  }

  async createToken({ id, role }: User | SignUser) {
    const payload: TokenPayload = { id, role };
    console.log('payload', payload);
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    console.log('token', token);
    return token;
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      secret: this.configService.get('SECRET_JWT'),
    });
  }
}
