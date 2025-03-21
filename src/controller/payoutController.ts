import { Payout as PayoutClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";
const xenditPayoutClient = new PayoutClient({ secretKey: API_KEY });

// ✅ Membuat Payout
export async function createPayout(c: Context) {
  try {
    const payoutData = await c.req.json();
    const idempotencyKey = payoutData.idempotencyKey; // Xendit butuh idempotencyKey
    const payout = await xenditPayoutClient.createPayout({
      idempotencyKey,
      data: payoutData,
    });
    return c.json(payout, 201);
  } catch (error) {
    console.error("Error creating payout:", error);
  }
}

// ✅ Mendapatkan Payout berdasarkan ID
export async function getPayoutByID(c: Context) {
  try {
    const id = c.req.param("id");
    const payout = await xenditPayoutClient.getPayoutById({ id });
    return c.json(payout, 200);
  } catch (error) {
    console.error("Error getting payout by ID:", error);
  }
}

export async function getPayouts(c: Context) {
  try {
    const id = c.req.param("id");
    const payouts = await xenditPayoutClient.getPayouts({
      referenceId: id,
    });
    return c.json(payouts, 200);
  } catch (error) {
    console.error("Error getting payouts:", error);
  }
}

// ✅ Membatalkan Payout (jika masih dalam status ACCEPTED)
export async function cancelPayout(c: Context) {
  try {
    const id = c.req.param("id");
    const payout = await xenditPayoutClient.cancelPayout({ id });
    return c.json(payout, 200);
  } catch (error) {
    console.error("Error cancelling payout:", error);
  }
}

// ✅ Mendapatkan daftar channel Payout yang tersedia
export async function getPayoutChannels(c: Context) {
  try {
    const channels = await xenditPayoutClient.getPayoutChannels();
    return c.json(channels, 200);
  } catch (error) {
    console.error("Error getting payout channels:", error);
  }
}
