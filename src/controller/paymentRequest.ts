import { Xendit, PaymentRequest as PaymentRequestClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditPaymentRequestClient = new PaymentRequestClient({
  secretKey: API_KEY,
});

export async function createPaymentRequest(c: Context) {
  try {
    const paymentRequestData = await c.req.json();
    const paymentRequest =
      await xenditPaymentRequestClient.createPaymentRequest({
        data: paymentRequestData,
      });
    return c.json(paymentRequest, 201);
  } catch (error) {
    console.error("Error creating payment request:", error);
  }
}
