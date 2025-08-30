import { User } from "@prisma/client";
import db from "../config/prismaClient";

const _createUser = async (credentials: any) => {
  return await db.user.create({
    data: credentials,
  });
};

const _getUserByEmail = async (email: string, provider: any = "web") => {
  const data = await db.user.findFirst({
    where: { email, provider: provider },
    include: {
      address: true,
      social: true,
    },
  });

  return data;
};

const _getAdminByEmail = async (email: string, provider: any = "web") => {
  const data = await db.user.findFirst({
    where: { email, provider: provider },
    include: {
      address: true,
      social: true,
    },
  });

  return data;
};

const _getUserById = async (id: string) => {
  const data = await db.user.findUnique({
    where: { id },
    include: {
      address: true,
      // recently_viewed: {
      //   orderBy: { createdAt: 'desc' },
      //   include: {
      //     product: {
      //       include: {
      //         material: true,
      //         category: true,
      //         sales_person: true
      //       }
      //     },
      //   }
      // },
      social: true,
      wishlist: { include: { product: true } },
      // cart: { include: { product: true } },
      // product: {
      //   include: {
      //     sales_person: true,
      //   },
      // },
      followers: true,
      following: true,
      linked_account: true,
    },
  });

  if (data) {
    data.social = data.social?.reduce((a: any, b: any) => {
      a[b.name] = b;
      return a;
    }, {});
  }

  return data;
};

const _updateUser = async (id: string, updates: any) => {
  const data = await db.user.update({
    where: { id },
    data: updates,
  });
  return data;
};

interface links {
  uid: string;
  name: string;
  utl: string;
}

const _addSocialMediaLink = async (id: string, links: Array<links>) => {
  let data: any = links.reduce((array: any, link: any) => {
    if (link.url) {
      let transaction = db.social.upsert({
        create: {
          ...link,
          user_id: id,
        },
        update: link,
        where: { user_id_name: { user_id: id, name: link.name } },
      });

      array.push(transaction);
    }

    return array;
  }, []);

  return await db.$transaction(data);
};

const _removeSocialMediaLink = async (id: string) => {
  return await db.social.delete({ where: { id } });
};

const _addUserAddress = async (address: any) => {
  return await db.address.create({ data: address });
};

const _deleteUserAddress = async (id: string) => {
  const data = await db.address.delete({ where: { id } });
  return data;
};

const _updateUserAddress = async (id: string, address: any) => {
  const data = await db.address.update({ where: { id }, data: address });
  return data;
};

const _addToWishlist = async (data: any) => {
  const res = await db.wishlist.create({ data });
  return res;
};

const _getUserWishlist = async (user_id: string) => {
  const res = await db.wishlist.findMany({
    where: { user_id },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
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

//artists/////////////////

const _getArtists = async () => {
  let selectedItems = {
    product: true,
    displayName: true,
    photo: true,
    id: true,
    email: true,
    social: true,
    followers: true,
  };

  let data: any = await db.user.findMany({
    where: {
      role: "seller",
    },
    select: selectedItems,
  });

  delete data.password;
  return data;
};

interface AF {
  userId: string;
  followingUserId: string;
}

const _addFollower = (userId: string, followingUserId: string) => {
  return db.followers.create({
    data: {
      userId,
      followingUserId,
    },
  });
};

const _removeFollower = (id: string) => {
  return db.followers.delete({
    where: { id },
  });
};

export {
  _createUser,
  _getUserByEmail,
  _getAdminByEmail,
  _getUserById,
  _updateUser,
  _addUserAddress,
  _deleteUserAddress,
  _updateUserAddress,
  _addToWishlist,
  _getUserWishlist,
  _removeFromlist,
  _addToRV,
  _addSocialMediaLink,
  _removeSocialMediaLink,
  _getArtists,
  _addFollower,
  _removeFollower,
};
