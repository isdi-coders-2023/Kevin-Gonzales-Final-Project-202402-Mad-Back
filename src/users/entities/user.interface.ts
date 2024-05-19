import { Club } from 'src/clubs/entities/club.interface.js';
import { ImgData } from 'src/types/image.data';

export class User {
  id: string;
  username: string;
  email: string;
  password?: string;
  country?: string;
  avatar: Partial<ImgData> | null;
  role: 'admin' | 'validator' | 'user';
  clubs?: Array<Partial<Club>>;
}

export class SignUser {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  role: 'admin' | 'validator' | 'user';
}
