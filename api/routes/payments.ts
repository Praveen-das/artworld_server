import express from "express";
import controller from '../controller/razorpayController'

const router = express.Router()

const { createOrder, verify, getLinkedAccounts, createLinkedAccount } = controller

router.get('/accounts', getLinkedAccounts)
router.post('/accounts', createLinkedAccount)
router.post('/orders', createOrder)
router.post('/verify', verify)

export default router