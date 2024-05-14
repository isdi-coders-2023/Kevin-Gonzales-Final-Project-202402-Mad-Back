import { Club } from 'src/clubs/entities/club.interface.js';
import { ImgData } from 'src/types/image.data';

type Role = 'admin' | 'validator' | 'user';

export class User {
  id: string;
  username: string;
  email: string;
  password?: string;
  country?: string;
  avatar: Partial<ImgData> | null;
  role: Role;
  clubs?: Array<Partial<Club>>;
}

export class SignUser {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  role: Role;
}
