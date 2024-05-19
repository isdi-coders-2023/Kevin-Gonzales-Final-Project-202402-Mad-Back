import { ImgData } from 'src/types/image.data';
import { User } from 'src/users/entities/user.interface.js';

export class Club {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo: Partial<ImgData> | null;
  description: string;
  state: 'validated' | 'pending';
  fans: Array<Partial<User>>;
}
