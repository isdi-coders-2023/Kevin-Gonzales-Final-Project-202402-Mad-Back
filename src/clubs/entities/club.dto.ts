import { ImgData } from 'src/types/image.data';

export class CreateClubDto {
  name: string;
  country: string;
  founded: number;
  logo?: ImgData | null;
}

export type UpdateClubDto = {
  name: string;
  country: string;
  founded: number;
  logo: ImgData | null;
  description?: string;
};
