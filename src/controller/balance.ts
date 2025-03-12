import type { Context } from "hono";
import { Balance as BalanceClient } from "xendit-node";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditBalanceClient = new BalanceClient({ secretKey: API_KEY });

export async function getBalance(c: Context) {
  try {
    const balance = await xenditBalanceClient.getBalance();
    return c.json(balance, 200);
  } catch (error) {
    console.error("Error getting balance:", error);
  }
}
