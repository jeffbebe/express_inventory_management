import { CreateProductCommand } from "../commands/createProduct.command";
import { productService } from "../services/product.service";

export class CreateProductHandler {
  async execute(command: CreateProductCommand) {
    return await productService.createProduct({
      name: command.name,
      description: command.description,
      price: command.price,
      stock: command.stock,
    });
  }
}
