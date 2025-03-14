import { Refund as RefundClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";
const xenditRefundClient = new RefundClient({ secretKey: API_KEY });

// Create Refund (POST /refunds)
export async function createRefund(c: Context) {
  try {
    const refundData = await c.req.json();
    const refund = await xenditRefundClient.createRefund({ data: refundData });

    return c.json(refund, 201);
  } catch (error) {
    console.error("Error creating refund:", error);
    return c.json({ error: "Failed to create refund" }, 500);
  }
}

// Get Refund by ID (GET /refunds/{refundID})
export async function getRefund(c: Context) {
  try {
    const refundID = c.req.param("refundID");

    const refund = await xenditRefundClient.getRefund({
      refundID,
    });

    return c.json(refund, 200);
  } catch (error) {
    console.error("Error fetching refund:", error);
    return c.json({ error: "Failed to fetch refund" }, 500);
  }
}

// Get All Refunds (GET /refunds)
export async function getAllRefunds(c: Context) {
  try {
    const refunds = await xenditRefundClient.getAllRefunds();

    return c.json(refunds, 200);
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return c.json({ error: "Failed to fetch refunds" }, 500);
  }
}

// Cancel Refund (POST /refunds/{refundID}/cancel)
export async function cancelRefund(c: Context) {
  try {
    const refundID = c.req.param("refundID");

    const refund = await xenditRefundClient.cancelRefund({
      refundID,
    });

    return c.json(refund, 200);
  } catch (error) {
    console.error("Error canceling refund:", error);
    return c.json({ error: "Failed to cancel refund" }, 500);
  }
}
