import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import services from "../services/userReviewServices";
import { prismaErrorHandler } from "../utils/PrismaErrorHandler";

const {
    _getProductReview,
    _addReview,
    _removeReview,
    _updateReview,
} = services

const getProductReview = (req: any, res: any, next: any) => {
    const product_id = req.params.id

    _getProductReview(product_id)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

const addReview = (req: any, res: any, next: any) => {
    const user_id = req.user.id
    const data = req.body
    data['user_id'] = user_id

    _addReview(data)
        .then((data) => res.status(200).send(data))
        .catch(err => {
            if (err instanceof PrismaClientKnownRequestError)
                return prismaErrorHandler(err, next)
            next(err)
        });
};

const deleteReview = (req: any, res: any, next: any) => {
    const review_id = req.params.id

    _removeReview(review_id)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

const updateReview = (req: any, res: any, next: any) => {
    const review_id = req.params.id
    const updates = req.body

    _updateReview(review_id, updates)
        .then((data) => res.status(200).send(data))
        .catch(next);
};

export default {
    getProductReview,
    addReview,
    deleteReview,
    updateReview,
}