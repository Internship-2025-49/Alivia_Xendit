import { Xendit, PaymentMethod as PaymentMethodClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";
const xenditPaymentMethodClient = new PaymentMethodClient({
  secretKey: API_KEY,
});

// Create Payment Method
export async function createPaymentMethod(c: Context) {
  try {
    const paymentMethodData = await c.req.json();
    const paymentMethod = await xenditPaymentMethodClient.createPaymentMethod({
      data: paymentMethodData,
    });

    return c.json(paymentMethod, 201);
  } catch (error) {
    console.error("Error creating payment method:", error);
    return c.json({ error: "Failed to create payment method" }, 500);
  }
}

// Get List of Payment Methods
export async function getPaymentMethods(c: Context) {
  try {
    const paymentMethods =
      await xenditPaymentMethodClient.getAllPaymentMethods();
    return c.json(paymentMethods, 200);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return c.json({ error: "Failed to fetch payment methods" }, 500);
  }
}

// Get Payment Method by ID
export async function getPaymentMethodById(c: Context) {
  try {
    const id = c.req.param("id");
    const paymentMethod = await xenditPaymentMethodClient.getPaymentMethodByID({
      paymentMethodId: id,
    });
    return c.json(paymentMethod, 200);
  } catch (error) {
    console.error("Error fetching payment method by ID:", error);
    return c.json({ error: "Failed to fetch payment method" }, 500);
  }
}

// Delete Payment Method
// export async function deletePaymentMethod(c: Context) {
//   try {
//     const id = c.req.param("id");
//     await xenditPaymentMethodClient.deletePaymentMethod({ paymentMethodId: id });
//     return c.json({ message: "Payment method deleted successfully" }, 200);
//   } catch (error) {
//     console.error("Error deleting payment method:", error);
//     return c.json({ error: "Failed to delete payment method" }, 500);
//   }
// }
