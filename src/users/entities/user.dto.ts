import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ImgData } from 'src/types/image.data';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username: string;
  @IsOptional()
  @IsEmail()
  @MinLength(6, {
    message: 'Title is too short. Remember: min 6.',
  })
  email: string;
  @IsOptional()
  country?: string;

  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  username: string;
  @IsString()
  @IsOptional()
  email?: string;
  @IsOptional()
  password?: string;
  @IsOptional()
  avatar?: ImgData;
  @IsString()
  @IsOptional()
  country?: string;
  @IsOptional()
  role: 'admin' | 'validator' | 'user';
}
