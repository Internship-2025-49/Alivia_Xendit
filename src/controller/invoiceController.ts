import { Invoice as InvoiceClient } from "xendit-node";
import type { Context } from "hono";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { invoices } from "../db/schema.js";
import type { invoiceValues } from "../type/invoices.js";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const xenditInvoiceClient = new InvoiceClient({ secretKey: API_KEY });

// export async function createInvoice(c: Context) {
//   try {
//     console.log("Request masuk ke createInvoice");
//     const invoiceData = await c.req.json();
//     console.log("Data yang diterima:", invoiceData);
//     const invoice = await xenditInvoiceClient.createInvoice({
//       data: invoiceData,
//     });
//     return c.json(invoice, 201);
//   } catch (error) {
//     console.error("Error creating invoice:", error);
//   }
// }

export async function createInvoice(c: Context) {
  try {
    const invoiceData = await c.req.json();
    const pendingInvoices = await db
      .select()
      .from(invoices)
      .where(eq(invoices.status, "PENDING"));

    if (pendingInvoices.length > 0) {
      const expiryDate = new Date(pendingInvoices[0].expiryDate);
      const now = new Date();
      if (expiryDate < now) {
        await db
          .update(invoices)
          .set({ status: "EXPIRED" })
          .where(eq(invoices.id, pendingInvoices[0].id));
      } else {
        return c.json({ error: "You already have a pending invoice" }, 400);
      }
    }

    const invoice = await xenditInvoiceClient.createInvoice({
      data: {
        ...invoiceData,
        successRedirectUrl: `http://localhost:3000/invoices/${invoiceData.externalId}/success`,
        failureRedirectUrl: `http://localhost:3000/invoices/${invoiceData.externalId}/failure`,
      },
    });

    await db.insert(invoices).values({
      invoiceId: invoice.id,
      externalId: invoice.externalId,
      userId: invoice.userId,
      status: invoice.status,
      merchantName: invoice.merchantName,
      merchantProfilePictureUrl: invoice.merchantProfilePictureUrl,
      amount: invoice.amount,
      expiryDate: invoice.expiryDate,
      invoiceUrl: invoice.invoiceUrl,
      created: new Date(invoice.created),
      updated: new Date(invoice.updated),
      currency: invoice.currency,
      customer: invoice.customer,
      items: invoice.items,
      fees: invoice.fees,
      availableBanks: invoice.availableBanks,
      availableRetailOutlets: invoice.availableRetailOutlets,
      availableEwallets: invoice.availableEwallets,
      availableQrCodes: invoice.availableQrCodes,
      availableDirectDebits: invoice.availableDirectDebits,
      availablePaylaters: invoice.availablePaylaters,
    } as invoiceValues);

    return c.json(invoice, 201);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return c.json({ error }, 400);
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
    if (!invoice) {
      return c.json({ error: "Invoice not found" }, 404);
    }
    return c.json(invoice, 200);
  } catch (error) {
    console.error("Error getting invoice by id:", error);
  }
}

export async function expireInvoice(c: Context) {
  try {
    const id = c.req.param("id");
    const invoice = await xenditInvoiceClient.expireInvoice({ invoiceId: id });

    await db
      .update(invoices)
      .set({
        status: "EXPIRED",
      })
      .where(eq(invoices.invoiceId, id));

    return c.json(invoice, 200);
  } catch (error) {
    console.error("Error expiring invoice:", error);
    return c.json({ error }, 400);
  }
}

export async function successInvoice(c: Context) {
  try {
    const id = c.req.param("id");
    const status = "SETTLED";

    const pendingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.externalId, id) && eq(invoices.status, "PENDING"));

    if (pendingInvoice.length > 0) {
      const invoiceToUpdate = await db
        .select()
        .from(invoices)
        .where(eq(invoices.externalId, id));
      await db
        .update(invoices)
        .set({ status })
        .where(eq(invoices.externalId, id));
      return c.json({ message: "Payment successful" }, 200);
    } else {
      return c.json({ error: "Invoice not found or not pending" }, 404);
    }
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return c.json({ error }, 400);
  }
}

export async function failureInvoice(c: Context) {
  try {
    const id = c.req.param("id");
    const status = "EXPIRED";

    const pendingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.externalId, id) && eq(invoices.status, "PENDING"));

    if (pendingInvoice.length > 0) {
      await db
        .update(invoices)
        .set({ status })
        .where(eq(invoices.externalId, id));
      return c.json({ message: "Payment failed" }, 400);
    } else {
      return c.json({ error: "Invoice not found or not pending" }, 404);
    }
  } catch (error) {
    console.error("Error handling invoice failure:", error);
    return c.json({ error }, 400);
  }
}
