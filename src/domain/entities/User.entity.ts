export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'Partner' | 'Admin';
  partnerId: string | null;
  megaSigla: string;
  quinaSigla: string;
}

