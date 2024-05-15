import { ImgData } from 'src/types/image.data';

export type CreateUserDto = {
  username: string;
  email: string;
  country?: string;
  password: string;
};

export type UpdateUserDto = {
  username: string;
  email?: string;
  password?: string;
  avatar?: ImgData;
  country?: string;
  role: 'admin' | 'validator' | 'user';
};
