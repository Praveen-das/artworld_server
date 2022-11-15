import db from "../config/prismaClient";

const _signupUser = async (credentials: any) => {
  const data = await db.user.create({
    data: credentials,
  });
  return data;
};

const getUserByEmail = async (email: string) => {
  const data = await db.user.findUnique({
    where: { email },
  });
  return data;
};

const getUserById = async (id: string) => {
  const data = await db.user.findUnique({
    where: { id },
  });
  return data;
};

const _updateUser = async (id: string, updates: any) => {
  const data = await db.user.update({
    where: { id },
    data: updates,
  });
  return data;
};

export { _signupUser, getUserByEmail, getUserById, _updateUser };
