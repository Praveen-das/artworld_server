import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ errorFormat: "minimal" });

const _getProductReview = async (product_id: string) => {
    let data = await db.$transaction([
        db.reviews.findMany({
            where: {
                product_id,
            },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        }),
        db.reviews.aggregate({
            where: { product_id },
            _avg: {
                vote: true
            },
            _count: {
                review: true
            }
        })
    ])

    const average_vote = data[1]._avg.vote
    const total_reviews = data[1]._count.review

    return [data[0], { average_vote, total_reviews }]
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
    try {
        const res = await db.reviews.update({
            where: { id },
            data
        })
        return res
    } catch (error) {
        console.log(error);
    }
}

export default {
    _getProductReview,
    _addReview,
    _removeReview,
    _updateReview,
}