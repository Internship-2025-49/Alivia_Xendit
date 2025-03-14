import { Hono } from "hono";
import * as transaction from "../controller/transactionController.js";

const app = new Hono();

app.get("/", (c) => transaction.getAllTransactions(c));

app.get("/:id", (c) => transaction.getTransactionByID(c));

export default app;
