import { serve } from "@hono/node-server";
import { Hono } from "hono";
import customer from "./routes/customer.js";
import balance from "./routes/balance.js";
import invoice from "./routes/invoice.js";
import paymentMethod from "./routes/paymentMethod.js";
import refund from "./routes/refunds.js";
import transaction from "./routes/transaction.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/balance", balance);
app.route("/customers", customer);
app.route("/invoices", invoice);
app.route("/payment_methods", paymentMethod);
app.route("/refunds", refund);
app.route("/transaction", transaction);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
