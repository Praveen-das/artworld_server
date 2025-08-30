import {
  _createLinkedAccount,
  _createRazorpayOrder,
  _createOrderForSellerRegistration,
  _requestProductConfiguration,
  _createStakeholder,
  _getLinkedAccounts,
  _updateProductConfiguration,
  _verify,
  addLinkedAccountToDb,
  _updateLinkedAccount,
  fetchTransfers,
} from "../services/razorpayServices";
import { _getUserById, _updateUser } from "../services/userServices";
import cartServices from "../services/cartServices";
import { sendOrderConfirmationMail } from "../services/nodeMailer";
import {
  _saveOrder,
  _createSalesOrder,
  _updateOrderById,
  _fetchOrderById,
  _savePayment,
} from "../services/salesOrderServices";
import { CLIENT_URL } from "../utils/urls";
import crypto from "crypto";
import { Request as _Request, Response, NextFunction } from "express";
import { Prisma, sales_order, Transfer, User } from "@prisma/client";
import { reserveStock } from "./inventoryController";
import { _consumeStock, _releaseStock, _reserveStock } from "../services/inventoryService";
import { Orders } from "razorpay/dist/types/orders";
import { CURRENCY } from "../consts";
import { OrderCreateRequestBody } from "../interfaces/types";
import db from "../db/prisma";

type Request = _Request & { user?: User };

const { _fetchUserCart } = cartServices;

async function createRegistrationOrder(req: any, res: any, next: any) {
  const AMOUNT = 799;
  const currency = "INR";
  const payment_capture = 1;

  const options = {
    amount: AMOUNT * 100,
    currency,
    receipt: crypto.randomUUID(),
    payment_capture,
  };

  _createOrderForSellerRegistration(options)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
}

async function createOrder(req: any, res: any, next: any) {
  const currency = "INR";
  const payment_capture = 1;

  const user_id = req.user?.id;
  const [cart_items]: any = await _fetchUserCart(user_id);

  const orders = cart_items?.map((item: any) => {
    let amount = item?.price * (item?.price / 100);
    return {
      amount: amount * 100,
      receipt: crypto.randomUUID(),
      currency,
      payment_capture,
    };
  });

  //   _createOrderForSellerRegistration()
  //     .then((response) => res.json(response))
  //     .catch((err) => res.send(err));
}

async function createOrderAndTransferAmount(req: any, res: any, next: any) {
  const transfers = [];
  const groupedBySeller: Record<string, Prisma.sales_orderCreateManyOrderInput[]> = {};

  try {
    const orders: OrderCreateRequestBody = req.body;

    for (let order of orders) {
      const { product } = await _reserveStock(order.productId, order.quantity);

      const subTotal = product.price * order.quantity;
      const discount = subTotal * (product.discount / 100);
      const total = Math.round(subTotal - discount);

      transfers.push({
        account: product.salesPersonAccountId,
        amount: total * 100,
        currency: CURRENCY,
        on_hold: false,
      });

      groupedBySeller[product.salesPersonId] = [
        ...(groupedBySeller[product.salesPersonId] || []),
        {
          quantity: order.quantity,
          price: total,
          discount: product.discount,
          productId: product.id,
        },
      ];
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return res.json({ error: error.message });
    res.json({ error });
  }

  const amount = transfers.reduce((i, c) => i + c.amount, 0);

  try {
    const order = await _createRazorpayOrder({ amount, transfers, currency: CURRENCY });

    if (order.status === "created") {
      db.$transaction(async () => {
        for (const [salesPersonId, items] of Object.entries(groupedBySeller)) {
          const savedOrder = await _saveOrder({
            id: order.id,
            salesPersonId,
            userId: req.user.id,
            items: { createMany: { data: items } },
          });
        }
      });

      return res.status(200).json(order);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}

async function verifyPurchase(req: Request & { user?: User }, res: Response, next: NextFunction) {
  if (!req.user) return res.sendStatus(401);

  const userId = req.user.id;
  const razorpay_order_id = req.body.razorpay_order_id;
  const paymentId = req.body.razorpay_payment_id;
  try {
    const isValid = await _verify(req.body);

    if (isValid) {
      const [order, rzpTransfers] = await Promise.all([_fetchOrderById(razorpay_order_id), fetchTransfers(paymentId)]);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (!rzpTransfers) {
        return res.status(400).json({ error: "No transfers found for this payment" });
      }

      const transfers = rzpTransfers.items.map<Prisma.TransferCreateManyPaymentInput>((t, idx) => ({
        id: t.id,
        salesOrderId: order.items[idx]?.id!,
      }));

      await db.$transaction(async () => {
        const { items } = await _updateOrderById(razorpay_order_id, {
          status: "paid",
          payment: {
            create: {
              id: paymentId,
              transfers: {
                createMany: {
                  data: transfers,
                },
              },
            },
          },
        });

        try {
          await Promise.all(items.map((order) => _consumeStock(order.productId, order.quantity)));
          res.json({ status: "success" });
        } catch (consumeError) {
          console.error("Error consuming stock:", consumeError);
          res.status(500).json({ error: "Failed to consume stock for one or more items." });
          throw consumeError; // rethrow to ensure transaction rollback
        }
      });

      // await sendOrderConfirmationMail({ username: req.user?.displayName });
    } else {
      throw new Error('"Invalid payment verification"');
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return res.json({ error: error.message });
    res.json({ error });
  }
}

async function verifyRegistration(req: any, res: any, next: any) {
  const userId = req.user.id;

  _verify(req.body)
    .then(async () => {
      await _updateUser(userId, { role: "seller", onboardingStatus: "pending" });
      res.json({ status: true });
    })
    .catch((err) => {
      res.json({ error: err });
    });
}

async function createSalesOrder(userId: string) {
  const [cart_items]: any = await _fetchUserCart(userId);

  const orders = [];

  for (let cart of cart_items) {
    const order = {
      cart_item_id: cart.id,
      customer_id: userId,
      seller_id: cart.product.sales_person_id,
    };
    orders.push(order);
  }

  return await _createSalesOrder(orders);
}

async function createLinkedAccount(req: Request, res: any, next: any) {
  const payload = req.body;

  if (!req.user) return res.sendStatus(403).json("Authentication reqiured");
  if (!payload) return res.sendStatus(400).json("Request parameters not found");

  const userId = req.user.id;

  try {
    const user = await _getUserById(userId);
    const accountId = user?.linked_account?.accountId;

    if (!accountId) {
      const account = await _createLinkedAccount(payload);
      const stakeholder = await _createStakeholder(payload, account.id);

      const data = {
        userId: req.user.id,
        accountId: account.id,
        stakeholderId: stakeholder.id,
        status: account.status,
      };

      await addLinkedAccountToDb(data);

      return res.json(account);
    } else {
      delete payload.email;
      const account = await _updateLinkedAccount(accountId, payload);
      return res.json(account);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function createProductConfiguration(req: any, res: any, next: any) {
  const payload = req.body;
  const user = req.user;
  const accountId = user?.linked_account?.accountId;

  if (!user) return res.sendStatus(403).json("Authentication reqiured");
  if (!payload) return res.sendStatus(400).json("Request parameters not found");
  if (!accountId) return res.sendStatus(403).json("Linked account id not found");

  try {
    // let productConfig = await _requestProductConfiguration(payload, accountId);
    // const account = await _updateProductConfiguration(payload, accountId, productConfig.id);
    const response = await _updateUser(user.id, { onboardingStatus: "success" });
    return res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getLinkedAccounts(req: any, res: any, next: any) {
  _getLinkedAccounts()
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
}

export default {
  createRegistrationOrder,
  createOrder,
  createOrderAndTransferAmount,
  verifyRegistration,
  verifyPurchase,
  createLinkedAccount,
  createProductConfiguration,
  getLinkedAccounts,
};
