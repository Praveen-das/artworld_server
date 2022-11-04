import db from "../config/prismaClient";

const _signupUser = async (credentials: any) => {
  const data = await db.user.create({
    data: credentials,
  });
  return data;
};

const getUserByUsername = async (username: string) => {
  const data = await db.user.findUnique({
    where: { username },
  });
  return data;
};

const getUserById = async (id: string) => {
  const data = await db.user.findUnique({
    where: { id },
  });
  return data;
};

export { _signupUser, getUserByUsername, getUserById };
