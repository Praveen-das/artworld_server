import express from "express";
import controller from '../controller/razorpayController'

const router = express.Router()

const { createOrder } = controller

router.post('/orders', createOrder)

export default router