import { Club } from 'src/clubs/entities/club.interface.js';

type Role = 'admin' | 'user';

export class User {
  id: string;
  username: string;
  email: string;
  password?: string;
  birthday: string;
  role: Role;
  clubs: Club[];
}
