import axios from "axios";
import dotenv from "dotenv";
import { InvoiceItemFromJSON } from "xendit-node/invoice/models/InvoiceItem.js";

dotenv.config();

const API_KEY = process.env.XENDIT_API_KEY || "";

const authToken = Buffer.from(API_KEY).toString("base64");

export async function createInvoice() {
  try {
    const { data, status } = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: "xendit_test123",
        amount: 25000,
        currency: "IDR",
        customer: {
          given_names: "Alivia",
          surname: "Pertiwi",
          email: "alivian@example.com",
          mobile_number: "+6283159608712",
        },
        customer_notification_preference: {
          invoice_paid: ["email", "whatsapp"],
        },
        success_redirect_url: "example.com/success",
        failure_redirect_url: "example.com/failure",
        items: [
          {
            name: "Eskrim cone",
            quantity: 2,
            price: 7000,
            category: "Fast Food",
          },
          {
            name: "Chocolate Sundae",
            quantity: 1,
            price: 3000,
            category: "dessert",
          },
        ],
        fees: [
          {
            type: "Shipping",
            value: 10000,
          },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      }
    );

    console.log(`Response returned with a status of ${status}`);

    const { invoice_url } = data;

    console.log(`Invoice created! Visit ${invoice_url} to complete payment`);
  } catch (error) {
    console.log("Request failed");
  }
}

createInvoice();
