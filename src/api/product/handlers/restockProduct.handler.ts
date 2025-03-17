import { RestockProductCommand } from "../commands/restockProduct.command";
import { productService } from "../services/product.service";

export class RestockProductHandler {
  async execute(command: RestockProductCommand) {
    return await productService.restockProduct(
      command.productId,
      command.amount
    );
  }
}
