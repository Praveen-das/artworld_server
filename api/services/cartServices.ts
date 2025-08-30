import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const _fetchUserCart = async (userId: string) => {
  const data = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              sales_person: {
                select: {
                  displayName: true,
                  email: true,
                  id: true,
                  photo: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      // product: {
      //   include: { sales_person: { include: { linked_account: true } } },
      // },
    },
  });

  // const { total_price, total_discount } = data.reduce(
  //   (sum, item) => {
  //     const { price, quantity, discount } = item;
  //     const itemPrice = price * quantity;
  //     const itemDiscount = price * quantity * (discount / 100);

  //     sum.total_price += itemPrice;
  //     sum.total_discount = sum.total_discount + itemDiscount;
  //     return sum;
  //   },
  //   { total_price: 0, total_discount: 0 }
  // );

  // const discount_price = total_price - total_discount;
  // const count = data.length;

  // return [data, { total_price, discount_price, total_discount, count }];
  return data;
};

const _addToCart = async (userId: string, payload: any) => {
  const data = await db.cart.upsert({
    where: { userId },
    create: { userId, items: { create: payload } },
    update: { items: { create: payload } },
  });
  return data;
};

const _removeFromCart = async (id: string) => {
  const data = await db.cart_item.delete({
    where: { id },
  });

  return data;
};

const _updateCart = async (id: string, data: any) => {
  const res = await db.cart_item.update({
    where: { id },
    data,
  });

  return res;
};

const _clearUserCart = async (userId: string) => {
  const data = await db.cart.update({
    where: { userId },
    data: { items: { deleteMany: {} } },
  });
  return data;
};

export default {
  _fetchUserCart,
  _addToCart,
  _removeFromCart,
  _updateCart,
  _clearUserCart,
};
