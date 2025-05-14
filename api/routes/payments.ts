import express from "express";
import controller from '../controller/razorpayController'

const router = express.Router()

const { createOrder, createOrderAndTransferAmount, verifyRegistration, verifyPurchase, getLinkedAccounts, createLinkedAccount } = controller

router.get('/accounts', getLinkedAccounts)
router.post('/accounts', createLinkedAccount)
router.post('/orders/registration', createOrder)
router.post('/orders/purchase', createOrderAndTransferAmount)
router.post('/registration/verify', verifyRegistration)
router.post('/purchase/verify', verifyPurchase)

export default router