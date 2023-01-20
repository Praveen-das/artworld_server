import { _createSalesOrder, _getOrdersByUserId, _getSalesOrderByUserId, _updateOrder } from "../services/salesOrderServices"

function createSalesOrder(req: any, res: any, next: any) {
    const { method, cart_items } = req.body
    const user_id = req.user?.id

    const orders = []

    if (!user_id) return res.send([])

    for (let cart of cart_items) {
        const order = {
            payment_method: method,
            cart_item_id: cart.id,
            customer_id: user_id,
            seller_id: cart.product.sales_person_id,
        }
        orders.push(order)
    }
    _createSalesOrder(orders).then(response => res.json(response))
}

function getSalesOrderByUserId(req: any, res: any, next: any) {
    const user_id = req.user?.id
    const query = req.query.q

    if (!user_id) return res.send([])
    _getSalesOrderByUserId(user_id, query).then(response => res.json(response))
}

function updateOrder(req: any, res: any, next: any) {
    const order_id = req.params.id
    const updates = req.body

    _updateOrder({ order_id, updates }).then(response => res.json(response))
}

function getOrdersByUserId(req: any, res: any, next: any) {
    const user_id = req.user?.id
    if (!user_id) return res.send([])

    _getOrdersByUserId(user_id).then(response => res.json(response))
}

export default {
    createSalesOrder,
    getSalesOrderByUserId,
    getOrdersByUserId,
    updateOrder
}