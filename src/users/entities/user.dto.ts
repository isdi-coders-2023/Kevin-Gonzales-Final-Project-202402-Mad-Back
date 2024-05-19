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
  avatar?: File;
  country?: string;
  role: 'admin' | 'validator' | 'user';
};

export type FilterUserDto = {
  country?: string;
  role?: 'admin' | 'validator' | 'user';
};
