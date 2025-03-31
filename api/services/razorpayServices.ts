import Razorpay from 'razorpay'
import crypto from 'crypto'
import { _updateUser } from './userServices';

const rzp = new Razorpay(
    {
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

const rzp_store = new Map()

export async function _createOrder() {
    const options = {
        amount: 50000, // amount in smallest currency unit
        currency: "INR",
        receipt: "receipt_order_74394",
    };

    let order = await rzp.orders.create(options)

    return order
}


export async function _createSubscription(userId: string) {
    let PLAN_ID = "plan_MYfqqAizrnXnlS"

    let options: any = {
        plan_id: PLAN_ID,
        customer_notify: 1,
        total_count: 2,
        // addons: [
        //     {
        //         item: {
        //             name: "Subscription charge",
        //             amount: 79900,
        //             currency: "INR"
        //         }
        //     }
        // ],
    }

    const subscription = await rzp.subscriptions.create(options)
    rzp_store.set(userId, subscription.id)

    return subscription
}

export async function _verifySubscription(userId: string, payment_id: string, razorpay_signature: string) {
    const subscription_id = rzp_store.get(userId)
    const key_secret = process.env.RAZORPAY_KEY_SECRET!

    const crypt = crypto.createHmac('sha256', key_secret)
    crypt.update(payment_id + '|' + subscription_id)
    const digest = crypt.digest('hex');

    if (digest === razorpay_signature) {
        await _updateUser(userId, {role:'seller'})
        return true
    } else {
        throw 'Signature mismatch.'
    }
}



