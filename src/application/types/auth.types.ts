export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  username: string;
  userId: string;
  role: string;
  megaSigla: string;
  quinaSigla: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  role: 'Partner' | 'Admin';
  partnerId: string;
  megaSigla: string;
  quinaSigla: string;
};

export type PartnerDto = {
  id: string;
  partnerId: string;
  username: string;
  megaSigla: string;
  quinaSigla: string;
};

