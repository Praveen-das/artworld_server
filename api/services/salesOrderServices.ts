import { Order, Prisma, PrismaClient, sales_order } from "@prisma/client";
import { QueryValidator, salesOrderQueryValidator } from "../controller/Utils/QueryValidator";
const db = new PrismaClient({ errorFormat: "minimal" });

export async function _saveOrder(create: Prisma.OrderUncheckedCreateInput) {
  return await db.order.create({ data: create, include: { items: true } });
}

export async function _savePayment(payment: Prisma.PaymentCreateInput) {
  return await db.payment.create({
    data: payment,
  });
}

export async function _updateOrderById(orderId: string, data: Prisma.OrderUpdateInput) {
  return await db.order.update({
    where: { id: orderId },
    data,
    include: { items: { include: { product: true } } },
  });
}

const include: Prisma.OrderInclude = {
  items: { include: { product: { include: { inventory: { select: { availableQty: true } } } } } },
  user: { include: { address: true } },
};

export async function _updateOrderStatus(
  orderId: string,
  status: Prisma.sales_orderUpdateInput["status"],
  reason?: string
) {
  return await db.sales_order.update({
    where: { id: orderId },
    data: { status, cancellationReason: reason },
    // include,
  });
}

export async function _fetchOrderById(orderId: string) {
  return await db.order.findUnique({ where: { id: orderId }, include });
}

export async function _deleteOrderById(orderId: string) {
  return await db.order.delete({ where: { id: orderId } });
}

export async function _createSalesOrder(orders: any) {
  return await Promise.all(orders.map(async (order: any) => await db.sales_order.create({ data: order })));
}

export async function _getSalesOrderByUserId(id: string, query: ReturnType<typeof salesOrderQueryValidator>) {
  let { q, p, limit, status } = query;

  const page = Math.max(1, p);

  const where: Prisma.sales_orderWhereInput = {
    status,
    order: { status: "paid", salesPersonId: id },
  };

  const include: Prisma.sales_orderInclude = {
    product: { include: { inventory: { select: { availableQty: true } } } },
    order: { include: { user: { include: { address: true } } } },
  };

  const whereTotal: Prisma.sales_orderWhereInput = { order: { status: "paid", salesPersonId: id } };

  const pagination = {
    skip: (page - 1) * limit,
    take: limit,
  };

  try {
    const data = await db.$transaction([
      db.sales_order.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
        ...pagination,
      }),
      db.sales_order.aggregate({
        _count: { _all: true },
        where: whereTotal,
      }),
      db.sales_order.aggregate({
        _count: { _all: true },
        where,
      }),
      db.sales_order.groupBy({
        by: ["status"],
        orderBy: { status: "desc" },
        where: whereTotal,
        _count: { status: true },
      }),
    ]);

    return {
      orders: data[0],
      total_orders: data[1]._count._all,
      total: data[2]._count._all,
      stats: data[3].reduce((i, c) => {
        if (c._count && typeof c._count !== "boolean") i[c.status] = c._count.status;
        return i;
      }, <Record<string, any>>{}),
    };
  } catch (error) {
    console.log(error);
  }

  // const data: any = await db.$transaction([
  //     db.sales_order.findMany({
  //         where: { seller_id: id, status: query },
  //         include: { cart_item: { include: { product: true } } },
  //         orderBy: {
  //             timer_order_taken: 'desc'
  //         }
  //     }),
  //     db.sales_order.count({
  //         where: { seller_id: id },
  //     }),
  //     status,
  // ])
  // const start = new Date().setUTCHours(0, 0, 0, 0)
  // const end = new Date().setUTCHours(23, 59, 59, 999)
  // const tt = await db.sales_order.findMany({
  //     where: { seller_id: id, timer_order_taken: { gte: new Date(start), lte: new Date(end) } },
  //     include: { cart_item: true }
  // })
  // const dailyEarnings = tt.reduce((x, y) => x += y.cart_item.price, 0)
  // data.push({ dailyEarnings })
  // return data
}

export async function _getOrdersByUserId(id: string) {
  return await db.sales_order.findMany({
    where: { order: { status: "paid", userId: id } },
    include: {
      product: true,
      order: {
        include: {
          salesPerson: { select: { displayName: true, linked_account: { select: { accountId: true } } } },
          user: { select: { address: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function _fetchOrdersById(id: string) {
  return await db.sales_order.findUnique({
    where: { id },
    include: { product: true },
  });
}

export async function _fetchTransferBySalesOrderId(salesOrderId: string) {
  return await db.transfer.findUnique({ where: { salesOrderId } });
}

export async function _updateSalesOrder({ order_id, updates }: any) {
  return await db.sales_order.update({ where: { id: order_id }, data: updates });
}
