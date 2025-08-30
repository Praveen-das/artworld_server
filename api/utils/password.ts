import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = 12;
  return await bcrypt.hash(password, salt);
};