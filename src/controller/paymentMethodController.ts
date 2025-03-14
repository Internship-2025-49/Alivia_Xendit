import { PaymentMethod as PaymentMethodClient } from "xendit-node";
import dotenv from "dotenv";
import type { Context } from "hono";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditPaymentMethodClient = new PaymentMethodClient({
  secretKey: API_KEY,
});

export async function createPaymentMethod(c: Context) {
  try {
    const paymentMethodData = await c.req.json();
    const paymentMethod = await xenditPaymentMethodClient.createPaymentMethod({
      data: paymentMethodData,
    });
    return c.json(paymentMethod, 201);
  } catch (error) {
    console.error("Error creating payment method:", error);
  }
}

export async function getPaymentMethodByID(c: Context) {
  try {
    const id = c.req.param("id");
    const paymentMethod = await xenditPaymentMethodClient.getPaymentMethodByID({
      paymentMethodId: id,
    });
    return c.json(paymentMethod, 200);
  } catch (error) {
    console.error("Error getting payment method by id:", error);
  }
}

export async function getPaymentsByPaymentMethodId(c: Context) {
  try {
    const id = c.req.param("id");
    const payments =
      await xenditPaymentMethodClient.getPaymentsByPaymentMethodId({
        paymentMethodId: id,
      });
    return c.json(payments, 200);
  } catch (error) {
    console.error("Error getting payments by payment method id:", error);
  }
}

export async function patchPaymentMethod(c: Context) {
  try {
    const id = c.req.param("id");
    const paymentMethodData = await c.req.json();
    const paymentMethod = await xenditPaymentMethodClient.patchPaymentMethod({
      paymentMethodId: id,
      data: paymentMethodData,
    });
    return c.json(paymentMethod, 200);
  } catch (error) {
    console.error("Error patching payment method:", error);
  }
}

export async function getAllPaymentMethods(c: Context) {
  try {
    const paymentMethods =
      await xenditPaymentMethodClient.getAllPaymentMethods();
    return c.json(paymentMethods, 200);
  } catch (error) {
    console.error("Error getting all payment methods:", error);
  }
}

export async function expirePaymentMethod(c: Context) {
  try {
    const id = c.req.param("id");
    const paymentMethod = await xenditPaymentMethodClient.expirePaymentMethod({
      paymentMethodId: id,
    });
    return c.json(paymentMethod, 200);
  } catch (error) {
    console.error("Error expiring payment method:", error);
  }
}

export async function authPaymentMethod(c: Context) {
  try {
    const id = c.req.param("id");
    const paymentMethodData = await c.req.json();
    const paymentMethod = await xenditPaymentMethodClient.authPaymentMethod({
      paymentMethodId: id,
      data: paymentMethodData,
    });
    return c.json(paymentMethod, 200);
  } catch (error) {
    console.error("Error expiring payment method:", error);
  }
}

export async function simulatePayment(c: Context) {
  try {
    const id = c.req.param("id");
    const paymentMethodData = await c.req.json();
    await xenditPaymentMethodClient.simulatePayment({
      paymentMethodId: id,
      data: paymentMethodData,
    });
    return c.json({ message: "simulate payment success" }, 200);
  } catch (error) {
    console.error("Error expiring payment method:", error);
  }
}
