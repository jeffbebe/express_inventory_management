import { SellProductCommand } from "../commands/sellProduct.command";
import { productService } from "../services/product.service";

export class SellProductHandler {
  async execute(command: SellProductCommand) {
    return await productService.sellProduct(command.productId, command.amount);
  }
}
