import { Order, OrderModel } from "../models/order.model";

export class GetOrdersQuery {}

export class GetOrdersHandler {
  async execute(): Promise<Order[]> {
    return await OrderModel.find()
      .populate("customerId")
      .populate("products.productId");
  }
}
