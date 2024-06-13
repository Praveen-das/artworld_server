import db from "../config/prismaClient";

const _signupUser = async (credentials: any) => {
  return await db.user.create({
    data: credentials,
  });
};

const getUserByEmail = async (email: string, provider?: "web") => {
  const data = await db.user.findFirst({
    where: { email, provider },
    include: {
      address: true,
    },
  });

  return data;
};

const getUserById = async (id: string) => {
  const data = await db.user.findUnique({
    where: { id },
    include: {
      address: true,
    },
  });
  console.log(data);

  return data;
};

const _updateUser = async (id: string, updates: any) => {
  const data = await db.user.update({
    where: { id },
    data: updates,
  });
  return data;
};

const _addUserAddress = async (address: any) => {
  const data = await db.address.create({ data: address });
  return data;
};

export {
  _signupUser,
  getUserByEmail,
  getUserById,
  _updateUser,
  _addUserAddress,
};
