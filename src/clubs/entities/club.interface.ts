import { User } from 'src/users/entities/user.interface.js';

type State = 'validated' | 'pending';

export class Club {
  id: string;
  name: string;
  country: string;
  founded: number;
  state: State;
  fans: Array<User>;
}
