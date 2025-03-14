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
    const customerData = await c.req.json(); // Ambil data dari request bod

    const customer = await xenditCustomerClient.createCustomer({
      data: {
        referenceId: customerData.referenceId, // Pakai data dari request body
        type: "INDIVIDUAL",
        clientName: customerData.clientName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        description: "Regular customer",
        individualDetail: {
          givenNames: customerData.givenNames,
          surname: customerData.surname,
          dateOfBirth: customerData.dateOfBirth,
          nationality: customerData.nationality,
        },
      },
    });

    console.log("Xendit Response:", customer);

    return c.json(customer, 201);
  } catch (error) {
    console.error("Full Error Object:", error);

    return c.json(
      {
        message: "Failed to create customer",
        error: error instanceof Error ? error.message : error,
        details:
          (error as any).response?.errors ||
          (error as any).rawResponse ||
          "No detailed error from Xendit",
      },
      400
    );
  }
}

export async function getAllCustomers(c: Context) {
  try {
    const response = await fetch("https://api.xendit.co/customers", {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    const customers = await response.json();
    return c.json(customers, 200);
  } catch (error) {
    console.error("Error getting all customers:", error);
    return c.json(
      {
        message: "Failed to get customers",
        error: error instanceof Error ? error.message : error,
      },
      400
    );
  }
}

export async function getCustomerByReferenceID(c: Context) {
  try {
    const referenceId = c.req.param("referenceId");
    const customer = await xenditCustomerClient.getCustomerByReferenceID({
      referenceId: referenceId,
    });
    return c.json(customer, 200);
  } catch (error) {
    console.error("Error getting customer by reference ID:", error);
  }
}

export async function updateCustomer(c: Context) {
  try {
    const id = c.req.param("id");
    const customerData = await c.req.json();
    const customer = await xenditCustomerClient.updateCustomer({
      id: id,
      data: customerData,
    });
    return c.json(customer, 200);
  } catch (error) {
    console.error("Error updating customer:", error);
  }
}
