import { _createLinkedAccount, _createOrderAndTransferAmount, _createOrderForSellerRegistration, _getLinkedAccounts, _verify } from "../services/razorpayServices";
import { _updateUser } from "../services/userServices";
import { Transfer } from "../types/razorpay";
import cartServices from '../services/cartServices'
import { sendOrderConfirmationMail } from "../services/nodeMailer";
import { _createSalesOrder } from "../services/salesOrderServices";
import { SERVER_URL } from "../utils/urls";

const { _fetchUserCart } = cartServices

function createOrder(req: any, res: any, next: any) {
    _createOrderForSellerRegistration()
        .then(response => res.json(response))
        .catch(err => res.send(err))
}

type CartResponse = {
    total_amount: any,
    overall: any,
}

async function createOrderAndTransferAmount(req: any, res: any, next: any) {
    const user_id = req.user?.id || '118373901310816826366'
    const [cart_items, cart]: any = await _fetchUserCart(user_id)

    const accounts = cart_items?.map((item: any) => (
        {
            account: item?.product?.sales_person?.linked_account?.accountId,
            amount: item?.price * 100,
            currency: 'INR',
            on_hold: false
        }
    ))

    const transfers: Transfer = {
        total_amount: cart?.total_price,
        accounts
    }

    _createOrderAndTransferAmount(transfers)
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log('error---------->', err);
            res.send(err)
        })
}

async function verifyRegistration(req: any, res: any, next: any) {
    const userId = req.user.id;

    _verify(req.body)
        .then(async () => {
            await _updateUser(userId, { role: 'seller' })
            res.redirect(`${SERVER_URL}/seller/onboarding`)
        })
        .catch(err => res.redirect(`${SERVER_URL}/seller/failed`))
}

async function createSalesOrder(userId: string) {
    const [cart_items]: any = await _fetchUserCart(userId)

    const orders = []

    for (let cart of cart_items) {
        const order = {
            cart_item_id: cart.id,
            customer_id: userId,
            seller_id: cart.product.sales_person_id,
        }
        orders.push(order)
    }

    return await _createSalesOrder(orders)
}

async function verifyPurchase(req: any, res: any, next: any) {
    const userId = req.user.id;

    _verify(req.body)
        .then(async () => {
            await createSalesOrder(userId)
            await sendOrderConfirmationMail({ username: req.user.displayName })
            res.redirect(`${SERVER_URL}/purchase/success`)
        })
        .catch((err) => {
            console.log(err);
            res.redirect(`${SERVER_URL}/seller/failed`)
        })
}

async function createLinkedAccount(req: any, res: any, next: any) {
    let payload = {
        userId: req.user.id,
        ...req.body
    }

    _createLinkedAccount(payload)
        .then(response => res.json(response.data))
        .catch(err => res.status(400).send(err.response.data))
}

async function getLinkedAccounts(req: any, res: any, next: any) {
    _getLinkedAccounts()
        .then(response => res.json(response))
        .catch(err => res.json(err))
}

export default {
    createOrder,
    createOrderAndTransferAmount,
    verifyRegistration,
    verifyPurchase,
    createLinkedAccount,
    getLinkedAccounts,
}