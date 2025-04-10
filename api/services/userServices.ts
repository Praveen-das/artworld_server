import db from "../config/prismaClient";

const _signupUser = async (credentials: any) => {
  return await db.user.create({
    data: credentials,
  });
};

const _getUserByEmail = async (email: string, provider: any = 'web') => {
  const data = await db.user.findFirst({
    where: { email, provider: provider },
    include: {
      address: { orderBy: { createdAt: 'desc' } },
      social: true
    },
  });

  return data;
};

const _getUserById = async (id: string) => {
  const data: any = await db.user.findUnique({
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
      },
      social: true,
      sales_order_personTosales_order_customer_id: { include: { cart_item: { include: { product: true } } } },
      wishlist: { include: { product: true } },
      cart: { include: { product: true } },
      product: {
        include: {
          sales_person: true
        }
      },
      followers: true,
      following: true
    },
  });

  if (data) {
    data.social = data.social?.reduce((a: any, b: any) => {
      a[b.name] = b
      return a
    }, {})
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
  uid: string,
  name: string,
  utl: string
}

const _addSocialMediaLink = async (id: string, links: Array<links>) => {
  let data: any = links.map((link: any) => {
    return db.social.upsert({
      create: {
        ...link,
        user_id: id
      },
      update: link,
      where: { user_id_name: { user_id: id, name: link.name } }
    })
  })

  return await db.$transaction(data)
}

const _removeSocialMediaLink = async (id: string) => {
  return await db.social.delete({ where: { id } })
}

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
  const res = await db.wishlist.findMany({ where: { user_id }, orderBy: { createdAt: 'desc' }, include: { product: true } });
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
    followers: true
  }

  let data: any = await db.user.findMany({
    // where:{
    //   role:'seller'
    // }
    select: selectedItems
  });

  delete data.password
  return data
}

interface AF {
  userId: string,
  followingUserId: string
}

const _addFollower = (userId: string, followingUserId: string) => {

  return db.followers.create({
    data: {
      userId,
      followingUserId
    }
  })
}

const _removeFollower = (id: string) => {
  return db.followers.delete({
    where: { id }
  })
}

export {
  _signupUser,
  _getUserByEmail,
  _getUserById,
  _updateUser,
  _addUserAddress,
  _deleteUserAddress,

  _addToWishlist,
  _getUserWishlist,
  _removeFromlist,
  _addToRV,

  _addSocialMediaLink,
  _removeSocialMediaLink,

  _getArtists,
  _addFollower,
  _removeFollower
};
