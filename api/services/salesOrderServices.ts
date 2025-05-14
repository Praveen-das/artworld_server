import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

export async function _createSalesOrder(orders: any) {
    return await Promise.all(
        orders.map(async (order: any) => (
            await db.sales_order.create({ data: order })
        ))
    )
}

export async function _getSalesOrderByUserId(id: string, query: null) {
    //@ts-ignore

    const status = db.sales_order.groupBy({
        by: ['status'],
        where: { seller_id: id },
        _count: { status: true }
    })

    const data: any = await db.$transaction([
        db.sales_order.findMany({
            where: { seller_id: id, status: query },
            include: { cart_item: { include: { product: true } } },
            orderBy: {
                timer_order_taken: 'desc'
            }
        }),
        db.sales_order.count({
            where: { seller_id: id },
        }),
        status,
    ])

    const start = new Date().setUTCHours(0, 0, 0, 0)
    const end = new Date().setUTCHours(23, 59, 59, 999)

    const tt = await db.sales_order.findMany({
        where: { seller_id: id, timer_order_taken: { gte: new Date(start), lte: new Date(end) } },
        include: { cart_item: true }
    })

    const dailyEarnings = tt.reduce((x, y) => x += y.cart_item.price, 0)

    data.push({ dailyEarnings })

    return data
}

export async function _updateOrder({ order_id, updates }: any) {
    return await db.sales_order.update({ where: { id: order_id }, data: updates })
}

export async function _getOrdersByUserId(id: string) {
    return await db.sales_order.findMany(
        {
            where: { customer_id: id },
            include: { cart_item: { include: { product: true } } },
            orderBy: {
                timer_order_taken: 'desc'
            }
        }
    )
}