import { _createOrder } from "../services/razorpayServices";

function createOrder(req: any, res: any, next: any) {
    const order = req.body
    
    _createOrder(order).then(response => res.json(response))
}

export default {
    createOrder
}