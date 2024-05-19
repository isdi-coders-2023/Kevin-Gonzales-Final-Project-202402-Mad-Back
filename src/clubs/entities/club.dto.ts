import { ImgData } from 'src/types/image.data';

export type CreateClubDto = {
  name: string;
  country: string;
  founded: number;
  logo?: ImgData | null;
};

export type UpdateClubDto = {
  name?: string;
  country?: string;
  founded?: number;
  logo?: ImgData | null;
  description?: string;
  state?: 'validated' | 'pending';
};
