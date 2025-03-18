import { Hono } from "hono";
import * as invoice from "../controller/invoiceController.js";
const app = new Hono();

app.post("/", (c) => invoice.createInvoice(c));

app.get("/:id", (c) => invoice.getInvoiceById(c));

app.get("/", (c) => invoice.getInvoices(c));

app.post("/:id/expire", (c) => invoice.expireInvoice(c));

app.get("/:id/success", (c) => invoice.successInvoice(c));

app.get("/:id/failure", (c) => invoice.failureInvoice(c));
export default app;
