import { Hono } from "hono";
import * as balance from "../controller/balanceController.js";
const app = new Hono();

app.get("/", (c) => balance.getBalance(c));

export default app;
