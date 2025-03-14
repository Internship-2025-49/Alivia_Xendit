import { Hono } from "hono";
import * as customer from "../controller/customerController.js";

const app = new Hono();

app.post("/", (c) => customer.createCustomer(c));

app.get("/:id", (c) => customer.getCustomer(c));

app.get("/reference/:referenceId", (c) => customer.getCustomerByReferenceID(c));

app.patch("/:id", (c) => customer.updateCustomer(c));

export default app;
