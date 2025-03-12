import { Invoice as InvoiceClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditInvoiceClient = new InvoiceClient({ secretKey: API_KEY });

export async function createInvoice(c: Context) {
  try {
    const invoiceData = await c.req.json();
    const invoice = await xenditInvoiceClient.createInvoice({
      data: invoiceData,
    });
    return c.json(invoice, 201);
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
}

export async function getInvoices(c: Context) {
  try {
    const invoice = await xenditInvoiceClient.getInvoices();
    return c.json(invoice, 200);
  } catch (error) {
    console.error("Error getting invoices:", error);
  }
}

export async function getInvoiceById(c: Context) {
  try {
    const id = c.req.param("id");
    const invoice = await xenditInvoiceClient.getInvoiceById({ invoiceId: id });
    return c.json(invoice, 200);
  } catch (error) {
    console.error("Error getting invoice by id:", error);
  }
}

export async function expireInvoice(c: Context) {
  try {
    const id = c.req.param("id");
    const invoice = await xenditInvoiceClient.expireInvoice({ invoiceId: id });
    return c.json(invoice, 200);
  } catch (error) {
    console.error("Error expiring invoice:", error);
  }
}
