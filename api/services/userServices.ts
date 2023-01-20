import db from "../config/prismaClient";

const _signupUser = async (credentials: any) => {
  return await db.user.create({
    data: credentials,
  });
};

const getUserByEmail = async (email: string, provider: any = 'web') => {
  const data = await db.user.findFirst({
    where: { email, provider: provider },
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
      recently_viewed: {
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: {
              material: true,
              category: true,
              sales_person: true
            }
          },
        }
      }
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

const _addToWishlist = async (data: any) => {
  const res = await db.wishlist.create({ data });
  return res;
};

const _getUserWishlist = async (user_id: string) => {
  const res = await db.wishlist.findMany({ where: { user_id } });
  return res;
};

const _removeFromlist = async (id: any) => {
  const res = await db.wishlist.delete({ where: { id } });
  return res;
};

const _addToRV = async (data: any) => {
  const res = await db.recently_viewed.create({ data });
  return res;
};

export {
  _signupUser,
  getUserByEmail,
  getUserById,
  _updateUser,
  _addUserAddress,
  _deleteUserAddress,

  _addToWishlist,
  _getUserWishlist,
  _removeFromlist,
  _addToRV
};
