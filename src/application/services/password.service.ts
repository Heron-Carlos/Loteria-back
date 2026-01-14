import bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

export const verifyPassword = (
  password: string,
  storedHash: string
): boolean => {
  return bcrypt.compareSync(password, storedHash);
};

