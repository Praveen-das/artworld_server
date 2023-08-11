import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const _fetchUserCart = async (user_id: string) => {
    const data = await db.$transaction([
        db.cart_item.findMany({
            where: { user_id },
            include: {
                product: {
                    include: { sales_person: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        db.cart_item.aggregate({
            where: { user_id },
            _sum: {
                price: true,
                discount: true
            },
            _count: {
                id: true
            }
        })
    ])

    const total_price = data[1]._sum.price
    const count = data[1]._count.id

    return [data[0], { total_price, count }]
}

const _addToCart = async (payload: any) => {
    const data = await db.cart_item.create({
        data: payload
    })
    return data
}

const _removeFromCart = async (id: string) => {
    const data = await db.cart_item.delete({
        where: { id }
    })

    return data
}

const _updateCart = async (id: string, data: any) => {
    const res = await db.cart_item.update({
        where: { id },
        data,
    })

    return res
}

const _clearUserCart = async (user_id: string) => {
    const data = await db.cart_item.deleteMany({
        where: { user_id: user_id }
    })
    return data
}

export default {
    _fetchUserCart,
    _addToCart,
    _removeFromCart,
    _updateCart,
    _clearUserCart,
}