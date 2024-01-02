import Razorpay from 'razorpay'
import crypto from 'crypto'
import { _updateUser } from './userServices';
import axiosClient from './libs/axiosClient';
import db from "../config/prismaClient";

const rzp = new Razorpay(
    {
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

const rzp_store = new Map()

export async function _createOrder() {
    const payment_capture = 1
    const amount = 799
    const currency = 'INR'

    const options = {
        amount: amount * 100,
        currency,
        receipt: crypto.randomUUID(),
        payment_capture
    }

    return await rzp.orders.create(options)
}

export async function _verify(userId: string, res: any) {
    const payment_id = res.razorpay_payment_id
    const order_id = res.razorpay_order_id
    const razorpay_signature = res.razorpay_signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET!

    const crypt = crypto.createHmac('sha256', key_secret)
    crypt.update(order_id + '|' + payment_id)
    const digest = crypt.digest('hex');

    if (digest === razorpay_signature) {
        return await _updateUser(userId, { role: 'seller' })
    } else {
        throw 'Signature mismatch.'
    }
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



