import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const _fetchUserCart = async (userId: string) => {
    const data = await db.cart_item.findMany({
        where: { user_id: userId },
        include: { product: true }
    })

    return data
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
        data
    })

    return res
}

const _clearUserCart = async (userId: string) => {
    const data = await db.cart_item.deleteMany({
        where: { user_id: userId }
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