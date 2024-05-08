import { IsString, IsNumber, MinLength, IsOptional } from 'class-validator';

export class CreateClubDto {
  @IsString()
  name: string;
  @IsString()
  country: string;
  @IsNumber()
  founded: number;
  @IsOptional()
  @IsString()
  avatar: string;
}

export class UpdateClubDto {
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'Title is too short',
  })
  name: string;
  @IsString()
  @IsOptional()
  country: string;
  @IsNumber()
  @IsOptional()
  founded: number;
}
