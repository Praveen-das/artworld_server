import Razorpay from "razorpay";
import crypto from "crypto";
import { _updateUser } from "./userServices";
import { rzpClient, rzpClientV2 } from "./libs/axiosClient";
import db from "../config/prismaClient";
import { Transfer } from "../interfaces/razorpay";
import { _createSalesOrder } from "./salesOrderServices";
import cartServices from "../services/cartServices";
import { Transfers } from "razorpay/dist/types/transfers";
import { Orders } from "razorpay/dist/types/orders";

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type Registration = {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: number;
};

export async function _createOrderForSellerRegistration(options: Registration) {
  return await rzp.orders.create(options);
}

export async function _createRazorpayOrder({ amount, transfers, currency }: Orders.RazorpayTransferCreateRequestBody) {
  const payment_capture = 1;

  const orderCreateRequestBody = {
    amount,
    transfers,
    currency,
    receipt: crypto.randomUUID(),
    payment_capture,
  };

  const res = await rzpClient
    .post<Orders.RazorpayOrder>("/orders", orderCreateRequestBody, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID!,
        password: process.env.RAZORPAY_KEY_SECRET!,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Error during Razorpay order creation:", err);
      throw err;
    });

  return res;
}

export async function _verify(data: any) {
  const key_secret = process.env.RAZORPAY_KEY_SECRET!;
  const order_id = data.razorpay_order_id;
  const payment_id = data.razorpay_payment_id;
  const razorpay_signature = data.razorpay_signature;

  if (!order_id || !payment_id || !razorpay_signature) {
    throw new Error("Missing required fields: order_id, payment_id, or razorpay_signature.");
  }

  try {
    const crypt = crypto.createHmac("sha256", key_secret);
    crypt.update(order_id + "|" + payment_id);
    const digest = crypt.digest("hex");

    if (digest === razorpay_signature) {
      console.log("payment successfull");
      return true;
    }

    console.log("payment failed");
    throw "Signature mismatch.";
  } catch (error) {
    throw error;
  }
}

export async function _getLinkedAccounts() {
  const data = await rzpClientV2
    .get("/accounts/acc_QmIQyGL7U98psT")
    .then((res) => res.data)
    .catch((res) => res.response.data);
  return data;
}

export async function addLinkedAccountToDb(data: any) {
  const res = await db.$transaction([
    db.linked_account.create({ data }),
    // db.user.update({ where: { id: data.userId }, data: { onboardingStatus: "success" } }),
  ]);
  return res;
}

export const _createLinkedAccount = async (requestParams: any) => {
  try {
    const addresses = {
      street1: requestParams.street1,
      street2: requestParams.street2,
      city: requestParams.city,
      state: requestParams.state,
      country: requestParams.country,
      postal_code: requestParams.postal_code,
    };

    const legal_info = {
      pan: requestParams.pan,
      gst: requestParams.gst,
    };

    const linkedAcntParams = {
      email: requestParams.email,
      phone: requestParams.phone,
      type: "route",
      legal_business_name: "Acme Corp",
      business_type: "individual",
      contact_name: requestParams.name,
      profile: {
        category: "ecommerce",
        subcategory: "arts_and_collectibles",
        addresses: { registered: addresses },
      },
    };
    return await rzpClientV2.post("/accounts", linkedAcntParams).then((res) => res.data);
  } catch (error: any) {
    console.log("error createLinkedAccount--->", error.response.data.error);
    throw error.response.data.error;
  }
};

export const _updateLinkedAccount = async (accountId: string, updates: any) => {
  return await rzpClientV2
    .patch(`/accounts/${accountId}`, updates)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export const _createStakeholder = async (payload: any, accountId: string) => {
  const stakeHolderParams = {
    name: payload.name,
    email: payload.email,
    kyc: {
      pan: payload.pan,
    },
  };

  return await rzpClientV2
    .post(`/accounts/${accountId}/stakeholders`, stakeHolderParams)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export const _updateStakeholder = async (accountId: string, stakeholderId: string, updates: any) => {
  return await rzpClientV2
    .patch(`/accounts/${accountId}/stakeholders/${stakeholderId}`, updates)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export const _requestProductConfiguration = async (payload: any, accountId: string) => {
  const productConfigParams = {
    product_name: "route",
    tnc_accepted: payload.tnc_accepted,
  };

  return await rzpClientV2
    .post(`/accounts/${accountId}/products`, productConfigParams)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export const _updateProductConfiguration = async (payload: any, accountId: string, productConfigId: string) => {
  const settlements = {
    account_number: payload.account_number,
    ifsc_code: payload.ifsc_code,
    beneficiary_name: payload.beneficiary_name,
  };

  const updateProductConfigParams = {
    settlements,
    tnc_accepted: payload.tnc_accepted,
  };

  return await rzpClientV2
    .patch(`/accounts/${accountId}/products/${productConfigId}`, JSON.stringify(updateProductConfigParams))
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export function fetchTransfers(paymentId: string) {
  return rzp.payments.fetchTransfer(paymentId);
}

export async function reverseTransfer(transferId: string, amount?: number) {
  try {
    const params = amount ? { amount } : undefined;
    const response = await rzpClient.post(`/transfers/${transferId}/reversals`, params);
    return response.data;
  } catch (error: any) {
    console.error("Error reversing transfer:", error.response?.data || error);
    throw error.response?.data || error;
  }
}

export async function refundPayment(paymentId: string, amount: number) {
  try {
    const params = { amount };
    const response = await rzpClient.post(`/payments/${paymentId}/refund`, params);
    return response.data;
  } catch (error: any) {
    console.error("Error refunding payment:", error.response?.data || error);
    throw error.response?.data || error;
  }
}
