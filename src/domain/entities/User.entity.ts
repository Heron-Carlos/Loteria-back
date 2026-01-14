export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'Partner' | 'Admin';
  partnerId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

