import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const _getProductReview = async (product_id: string) => {
    const data: any = await db.reviews.findMany({
        where: {
            product_id,
        },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    })

    return data
}

const _addReview = async (payload: any) => {
    const data = await db.reviews.create({
        data: payload
    })

    return data
}

const _removeReview = async (id: string) => {
    const data = await db.reviews.delete({
        where: { id }
    })

    return data
}

const _updateReview = async (id: string, data: any) => {
    const res = await db.reviews.update({
        where: { id },
        data
    })

    return res
}

export default {
    _getProductReview,
    _addReview,
    _removeReview,
    _updateReview,
}