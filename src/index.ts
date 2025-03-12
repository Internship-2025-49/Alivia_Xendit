import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as invoice from "./controller/invoice.js";
import * as balance from "./controller/balance.js";
import * as checkout from "./controller/checkout.js";
import * as PaymentRequest from "./controller/paymentRequest.js";
import * as transaction from "./controller/transaction.js";
import {
  createPaymentMethod,
  getPaymentMethodById,
  getPaymentMethods,
} from "./controller/paymentMethod.js";
import {
  createRefund,
  getRefund,
  getAllRefunds,
  cancelRefund,
} from "./controller/refund.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/invoice", (c) => invoice.createInvoice(c));

app.get("/invoice", (c) => invoice.getInvoices(c));

app.get("/invoice/:id", (c) => invoice.getInvoiceById(c));

app.post("/invoice/:id", (c) => invoice.expireInvoice(c));

app.get("/balance", (c) => balance.getBalance(c));

app.get("/checkout", async (c) => {
  try {
    const invoice = await checkout.createInvoice();
    return c.json({ message: "Invoice created", invoice });
  } catch (error) {
    return c.json({ error: "Failed to create invoice" }, 500);
  }
});

app.post("/refunds", createRefund);
app.get("/refunds/:refundID", getRefund);
app.get("/refunds", getAllRefunds);
app.post("/refunds/:refundID/cancel", cancelRefund);

app.post("/payment-method", createPaymentMethod);
app.get("/payment-methods", getPaymentMethods);
app.get("/payment-method/:id", getPaymentMethodById);

app.post("/payment_request", (c) => PaymentRequest.createPaymentRequest(c));

app.get("/transaction", (c) => transaction.getAllTransactions(c));
app.get("/transaction/:id", transaction.getTransactionByID);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
