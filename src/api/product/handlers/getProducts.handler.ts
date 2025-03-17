import { GetProductsQuery } from "../queries/getProducts.query";
import { productService } from "../services/product.service";

export class GetProductsHandler {
  async execute(_command: GetProductsQuery) {
    return await productService.getProducts();
  }
}
