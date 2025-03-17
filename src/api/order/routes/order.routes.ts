import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

export const orderRouter = Router();
const orderController = new OrderController();

orderRouter.post("/", orderController.createOrder);
orderRouter.get("/", orderController.getOrders);
