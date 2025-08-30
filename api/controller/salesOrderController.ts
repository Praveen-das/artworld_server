import { _releaseStock } from "../services/inventoryService";
import { fetchTransfers, refundPayment, reverseTransfer } from "../services/razorpayServices";
import {
  _createSalesOrder,
  _deleteOrderById,
  _fetchOrderById,
  _fetchTransferBySalesOrderId,
  _getOrdersByUserId,
  _getSalesOrderByUserId,
  _updateOrderById,
  _updateOrderStatus,
} from "../services/salesOrderServices";
import { QueryValidator, salesOrderQueryValidator } from "./Utils/QueryValidator";

function createSalesOrder(req: any, res: any, next: any) {
  const { cart_items } = req.body;
  const user_id = req.user?.id;

  const orders = [];

  if (!user_id) return res.send([]);

  for (let cart of cart_items) {
    const order = {
      cart_item_id: cart.id,
      customer_id: user_id,
      seller_id: cart.product.sales_person_id,
    };
    orders.push(order);
  }

  _createSalesOrder(orders).then((response) => res.json(response));
}

function getSalesOrderByUserId(req: any, res: any, next: any) {
  const user_id = req.user?.id;

  let query = salesOrderQueryValidator(req.query);

  if (!user_id) return res.send([]);
  _getSalesOrderByUserId(user_id, query).then((response) => res.json(response));
}

function updateOrder(req: any, res: any, next: any) {
  const order_id = req.params.id;
  const updates = req.body;

  _updateOrderById(order_id, updates).then((response) => res.json(response));
}

function updateOrderStatus(req: any, res: any, next: any) {
  const { orderId, status } = req.body;
  _updateOrderStatus(orderId, status).then((response) => res.json(response));
}

function getOrdersByUserId(req: any, res: any, next: any) {
  const user_id = req.user?.id;
  if (!user_id) return res.send([]);

  _getOrdersByUserId(user_id).then((response) => res.json(response));
}

async function cancelOrder(req: any, res: any, next: any) {
  const orderId = req.params.id;
  const { reason } = req.body;

  if (!orderId) return res.json({ error: "orderId not provided" });

  res.json("ok");
  // Reverse the transfer for the specific sales_person_account_id using paymentId
  // try {
  //   const transfer = await _fetchTransferBySalesOrderId(orderId);

  //   if (!transfer) {
  //     return res.json({ error: "No transfer found for this orderId" });
  //   }
  //   console.log({ transfer });

  //   // Reverse the found transfer
  //   const reversal = await reverseTransfer(transfer.id);

  //   if (!reversal?.id) {
  //     return res.json({ error: "Transfer reversal failed", reversal });
  //   }
  //   console.log({ reversal });

  //   // Ensure paymentId and reversal.amount are defined before refunding
  //   if (!transfer.paymentId || reversal.amount === undefined || reversal.amount === null) {
  //     return res.json({ error: "Missing paymentId or reversal amount", transfer, reversal });
  //   }

  //   // Refund the payment using paymentId
  //   const refund = await refundPayment(transfer.paymentId, reversal.amount);

  //   console.log({ refund });

  //   const response = await _updateOrderStatus(orderId, "cancelled", reason);

  //   if (!response) {
  //     return res.json({ error: "Failed to update order status", details: response });
  //   }

  //   console.log({ response });
  //   res.json(refund);
  // } catch (error) {
  //   res.status(500).json({ error });
  // }
}

async function dismisOrder(req: any, res: any, next: any) {
  const orderId = req.params.id;

  if (!orderId) return res.json({ error: "orderId not provided" });

  const order = await _fetchOrderById(orderId);

  if (!order) return res.json({ error: `no order found with the ${orderId}` });

  for (let item of order.items) {
    await _releaseStock(item.productId, item.quantity);
  }

  await _deleteOrderById(order.id);

  return res.json({ count: order.items.length });
}

export default {
  createSalesOrder,
  getSalesOrderByUserId,
  getOrdersByUserId,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  dismisOrder,
};
