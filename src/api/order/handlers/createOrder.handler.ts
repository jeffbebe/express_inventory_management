import { CreateOrderCommand } from "../commands/createOrder.command";
import { orderService } from "../services/order.service";

export class CreateOrderHandler {
  async execute(command: CreateOrderCommand) {
    return orderService.createOrder(command);
  }
}
