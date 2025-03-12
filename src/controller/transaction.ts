import { Transaction as TransactionClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditTransactionClient = new TransactionClient({ secretKey: API_KEY });

export async function getAllTransactions(c: Context) {
  try {
    const transaction = await xenditTransactionClient.getAllTransactions();
    return c.json(transaction, 200);
  } catch (error) {
    console.error("Error getting transaction:", error);
  }
}

export async function getTransactionByID(c: Context) {
  try {
    const id = c.req.param("id");
    const transaction = await xenditTransactionClient.getTransactionByID({
      id: id,
    });
    return c.json(transaction, 200);
  } catch (error) {
    console.error("Error getting transaction by id:", error);
  }
}
