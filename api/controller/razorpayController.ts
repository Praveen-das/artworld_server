import { _createOrder, _createSubscription, _verifySubscription } from "../services/razorpayServices";

function createOrder(req: any, res: any, next: any) {

    _createOrder()
        .then(response => res.json(response))
        .catch(err => res.send(err))
}
function createSubscription(req: any, res: any, next: any) {
    const userId = req.user?.id;

    _createSubscription(userId)
        .then(response => res.json(response))
        .catch(err => res.send(err))
}
function verifySubscription(req: any, res: any, next: any) {
    const userId = req.user?.id;
    const { payment_id, razorpay_signature } = req.body

    _verifySubscription(userId, payment_id, razorpay_signature)
        .then(response => res.sendStatus(200))
        .catch(err => res.send(err))
}

export default {
    createOrder,
    createSubscription,
    verifySubscription
}