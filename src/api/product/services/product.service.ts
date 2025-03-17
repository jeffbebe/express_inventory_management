import { BadRequestException } from "../../../common/errors/bad-request.error";
import { NotFoundException } from "../../../common/errors/not-found.error";
import { Product, ProductModel } from "../models/product.model";

export class ProductService {
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    return await ProductModel.create(data);
  }

  async getProducts() {
    return await ProductModel.find();
  }

  async findAllProductsByIds(ids: string[]) {
    return await ProductModel.find().where("_id").in(ids).exec();
  }

  async restockProduct(productId: string, quantity: number) {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantity } },
      { new: true }
    );

    if (!product) {
      throw new NotFoundException({ message: "Product not found" });
    }
  }

  async sellProduct(productId: string, quantity: number) {
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new NotFoundException({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      throw new BadRequestException({ message: "Insufficient stock" });
    }

    product.stock -= quantity;
    return await product.save();
  }
}

export const productService = new ProductService();
