import express from "express";
import controller from "../controller/userReviewController";

const router = express.Router()

const {
    getProductReview,
    addReview,
    deleteReview,
    updateReview,
} = controller;

router.get("/:id", getProductReview);
router.post("/add", addReview);
router.put("/update/:id", deleteReview);
router.delete("/delete/:id", updateReview);

/*----------->> ERROR HANDLER <<-----------*/
router.use((err: any, req: any, res: any, next: any) => {
    console.log('ERROR HANDLER USER REVIEWS');
    res.status(err.code).send(err.error);
});

export default router;