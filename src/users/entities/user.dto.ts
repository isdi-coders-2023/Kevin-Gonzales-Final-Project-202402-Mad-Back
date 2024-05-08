import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  email: string;
  @MinLength(6, {
    message: 'Title is too short. Remember: min 8.',
  })
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  username: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsStrongPassword()
  @IsOptional()
  password?: string;
}
