import Razorpay from 'razorpay'
import crypto from 'crypto'
import { _updateUser } from './userServices';
import axiosClient from './libs/axiosClient';
import db from "../config/prismaClient";
import { Transfer } from '../types/razorpay';
import { _createSalesOrder } from './salesOrderServices';
import cartServices from '../Services/cartServices'

const { _fetchUserCart } = cartServices


const rzp = new Razorpay(
    {
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!
    })


export async function _createOrderForSellerRegistration() {
    const currency = 'INR'
    const payment_capture = 1
    const amount = 799

    const options = {
        amount: amount * 100,
        currency,
        receipt: crypto.randomUUID(),
        payment_capture
    }

    return await rzp.orders.create(options)
}

export async function _createOrderAndTransferAmount(transfers: Transfer) {
    const currency = 'INR'
    const payment_capture = 1
    const amount = 799

    const options = {
        amount: transfers.total_amount * 100,
        currency,
        receipt: crypto.randomUUID(),
        payment_capture,
        transfers: transfers.accounts
    }

    return await rzp.orders.create(options)
}

export async function _verify(data: any) {
    const razorpay_signature = data.razorpay_signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET!
    const payment_id = data.razorpay_payment_id
    const order_id = data.razorpay_order_id


    const crypt = crypto.createHmac('sha256', key_secret)
    crypt.update(order_id + '|' + payment_id)
    const digest = crypt.digest('hex');

    if (digest === razorpay_signature) return true
    throw 'Signature mismatch.'
}

export async function _getLinkedAccounts() {
    const data = await axiosClient('/accounts')
        .then(res => res.data)
        .catch(res => res.response.data)
    return data
}

export async function addLinkedAccountToDb(data: any) {
    return db.linked_account.create({ data })
}

export async function _createLinkedAccount({ userId, ...payload }: any) {
    const res = await axiosClient.post('/accounts', payload)
        .then(async (response) => {
            const data = {
                userId,
                accountId: response.data.id,
                status: 'active'
            }
            await addLinkedAccountToDb(data)
            return response
        })

    return res
}



