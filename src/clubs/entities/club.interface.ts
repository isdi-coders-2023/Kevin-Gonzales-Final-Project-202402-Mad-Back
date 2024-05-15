import { ImgData } from 'src/types/image.data';
import { User } from 'src/users/entities/user.interface.js';

type State = 'validated' | 'pending';

export class Club {
  id: string;
  name: string;
  country: string;
  founded: number;
  logo: Partial<ImgData> | null;
  state: State;
  fans: Array<User>;
}
