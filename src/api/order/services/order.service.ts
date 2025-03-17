import mongoose from "mongoose";
import { BadRequestException } from "../../../common/errors/bad-request.error";
import { NotFoundException } from "../../../common/errors/not-found.error";
import {
  ProductDocument,
  ProductModel,
} from "../../product/models/product.model";
import { CreateOrderCommand } from "../commands/createOrder.command";
import { OrderDocument, OrderModel } from "../models/order.model";
import { productService } from "../../product/services/product.service";

export class OrderService {
  async createOrder({
    continentCode,
    customerId,
    products,
  }: CreateOrderCommand): Promise<OrderDocument> {
    const productQuantities = products.reduce((acc, item) => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
      return acc;
    }, {} as { [productId: string]: number });

    const entityMap: {
      [productId: string]: { product: ProductDocument; quantity: number };
    } = {};

    const productsDocs = await productService.findAllProductsByIds(
      Object.keys(productQuantities)
    );

    let totalAmountBeforeDiscount = 0;

    for (const item of products) {
      const productDoc = productsDocs.find((it) => it.id === item.productId);

      if (!productDoc) {
        throw new NotFoundException({
          message: `Product with id ${item.productId} does not exist`,
        });
      }

      if (productDoc.stock < item.quantity) {
        throw new BadRequestException({
          message: `Product with id ${item.productId} does not have sufficient stock amount`,
        });
      }

      entityMap[item.productId] = {
        product: productDoc,
        quantity: item.quantity,
      };

      totalAmountBeforeDiscount += item.quantity * productDoc.price;
    }

    const volumeDiscount = this.getDiscountByQuantity(productQuantities);
    const seasonalDiscount = this.getSeasonalDiscount();
    const locationBasedPricing = this.getLocationBasedPricing(continentCode);
    const totalAmount = this.getTotalPrice(
      totalAmountBeforeDiscount,
      volumeDiscount,
      seasonalDiscount,
      locationBasedPricing
    );

    let order = new OrderModel({
      customerId,
      products: Object.entries(productQuantities).map(([key, val]) => ({
        productId: key,
        quantity: val,
      })),
      totalAmount,
    });

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      for (const [_productId, data] of Object.entries(entityMap)) {
        data.product.stock = data.product.stock - data.quantity;

        await data.product.save({ session });
      }

      await order.save({ session });
    });

    return order;
  }

  private getDiscountByQuantity(quantities: {
    [productId: string]: number;
  }): number {
    const total = Object.values(quantities).reduce((acc, curr) => {
      return (acc += curr);
    }, 0);

    if (total >= 50) {
      return 30;
    }
    if (total >= 10) {
      return 20;
    }
    if (total >= 5) {
      return 10;
    }
    return 0;
  }

  private getSeasonalDiscount(): number {
    // Seasonal discounts (using example holiday dates)
    const today = new Date();
    const isBlackFriday = today.getMonth() === 10 && today.getDate() === 29; // Example Black Friday (Nov 29)
    const isHolidaySale = today.getMonth() === 11; // December (Holiday sales)

    return isBlackFriday ? 25 : isHolidaySale ? 15 : 0;
  }

  private getLocationBasedPricing(
    continentCode: CreateOrderCommand["continentCode"]
  ): number {
    switch (continentCode) {
      case "EU":
        return 15;

      case "AS":
        return -5;

      default:
        return 0;
    }
  }

  private getTotalPrice(
    totalProductsPrice: number,
    volumeDiscount: number,
    seasonalDiscount: number,
    locationBasedPricing: number
  ): number {
    const bestDiscount = Math.max(volumeDiscount, seasonalDiscount);

    const discountedPrice = ((100 - bestDiscount) / 100) * totalProductsPrice;

    const finalPriceLocationBased =
      discountedPrice * ((100 + locationBasedPricing) / 100);

    return finalPriceLocationBased;
  }
}

export const orderService = new OrderService();
