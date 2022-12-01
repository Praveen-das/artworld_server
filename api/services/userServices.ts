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
      address: { orderBy: { createdAt: 'desc' } },
    },
  });

  return data;
};

const getUserById = async (id: string) => {
  const data = await db.user.findUnique({
    where: { id },
    include: {
      address: { orderBy: { createdAt: 'desc' } },
    },
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

const _addUserAddress = async (address: any) => {
  try {
    const data = await db.address.create({ data: address });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const _updateUserAddress = async (id: string, address: any) => {
  // const data = await db.address.update({ data: address, where: { id } });
  // return data;
};

const _deleteUserAddress = async (id: string) => {
  const data = await db.address.delete({ where: { id } });
  return data;
};


export {
  _signupUser,
  getUserByEmail,
  getUserById,
  _updateUser,
  _addUserAddress,
  _deleteUserAddress
};
