import express from "express";
import controller from '../controller/razorpayController'

const router = express.Router()

const { createOrder, createSubscription, verifySubscription } = controller

router.post('/orders', createOrder)
router.post('/subscriptions/create', createSubscription)
router.post('/subscriptions/verify', verifySubscription)

export default router