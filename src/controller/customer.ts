import { Customer as CustomerClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditCustomerClient = new CustomerClient({ secretKey: API_KEY });

export async function getCustomer(c: Context) {
  try {
    const id = c.req.param("id");
    const customer = await xenditCustomerClient.getCustomer({ id: id });
    return c.json(customer, 200);
  } catch (error) {
    console.error("Error getting customer:", error);
  }
}

export async function createCustomer(c: Context) {
  try {
    const customerData = await c.req.json();
    const customer = await xenditCustomerClient.createCustomer({
      data: {
        referenceId: "Merchant&#39",
        clientName: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "+6281234567890",
      },
    });
    return c.json(customer, 201);
  } catch (error) {
    console.error("Error creating customer:", error);
  }
}
