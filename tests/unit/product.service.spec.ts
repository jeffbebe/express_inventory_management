import mongoose from "mongoose";
import { continentCodeMap } from "../../src/api/order/models/continentCode.model";
import { OrderModel } from "../../src/api/order/models/order.model";
import { OrderService } from "../../src/api/order/services/order.service";
import { ProductModel } from "../../src/api/product/models/product.model";
import { productService } from "../../src/api/product/services/product.service";
import { BadRequestException } from "../../src/common/errors/bad-request.error";
import { NotFoundException } from "../../src/common/errors/not-found.error";

jest.mock("mongoose", () => ({
  startSession: jest.fn().mockResolvedValue({
    withTransaction: jest.fn((fn) => fn()),
  }),
  Schema: jest.fn(),
  model: jest.fn(),
}));

jest.mock("../../src/api/product/services/product.service", () => ({
  productService: {
    findAllProductsByIds: jest.fn(),
  },
}));

jest.mock("../../src/api/order/models/order.model", () => ({
  OrderModel: jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  })),
}));

jest.mock("../../src/api/product/models/product.model", () => ({
  ProductModel: jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  })),
}));

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
    jest.clearAllMocks();
  });

  it("should create an order successfully", async () => {
    const mockProducts = [
      { _id: "1", id: "1", price: 100, stock: 10, save: jest.fn() },
      { _id: "2", id: "2", price: 200, stock: 20, save: jest.fn() },
    ];

    jest
      .spyOn(productService, "findAllProductsByIds")
      .mockResolvedValue(mockProducts as any);

    const createOrderCommand = {
      continentCode: "EU" as keyof typeof continentCodeMap,
      customerId: "customer1",
      products: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 3 },
      ],
    };

    const result = await orderService.createOrder(createOrderCommand);

    expect(result.totalAmount).toEqual(expect.any(Number));
  });

  it("should throw NotFoundException if product does not exist", async () => {
    jest.spyOn(productService, "findAllProductsByIds").mockResolvedValue([]);

    const createOrderCommand = {
      continentCode: "EU" as keyof typeof continentCodeMap,
      customerId: "customer1",
      products: [{ productId: "1", quantity: 2 }],
    };

    await expect(orderService.createOrder(createOrderCommand)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should throw BadRequestException if product stock is insufficient", async () => {
    const mockProducts = [
      { _id: "1", id: "1", price: 100, stock: 1, save: jest.fn() },
    ];
    jest
      .spyOn(productService, "findAllProductsByIds")
      .mockResolvedValue(mockProducts as any);

    const createOrderCommand = {
      continentCode: "EU" as keyof typeof continentCodeMap,
      customerId: "customer1",
      products: [{ productId: "1", quantity: 2 }],
    };

    await expect(orderService.createOrder(createOrderCommand)).rejects.toThrow(
      BadRequestException
    );
  });

  it("should apply discounts and calculate total amount correctly", async () => {
    const mockProducts = [
      { _id: "1", id: "1", price: 100, stock: 10, save: jest.fn() },
      { _id: "2", id: "2", price: 200, stock: 20, save: jest.fn() },
    ];
    jest
      .spyOn(productService, "findAllProductsByIds")
      .mockResolvedValue(mockProducts as any);

    const createOrderCommand = {
      continentCode: "EU" as keyof typeof continentCodeMap,
      customerId: "customer1",
      products: [
        { productId: "1", quantity: 5 },
        { productId: "2", quantity: 10 },
      ],
    };

    const result = await orderService.createOrder(createOrderCommand);

    expect(result.totalAmount).toBeLessThan(2500); // Check if discounts are applied
  });

  it("should calculate total amount without discounts correctly", async () => {
    const mockProducts = [
      { _id: "1", id: "1", price: 100, stock: 10, save: jest.fn() },
      { _id: "2", id: "2", price: 200, stock: 20, save: jest.fn() },
    ];
    jest
      .spyOn(productService, "findAllProductsByIds")
      .mockResolvedValue(mockProducts as any);

    const createOrderCommand = {
      continentCode: "NA" as keyof typeof continentCodeMap,
      customerId: "customer1",
      products: [
        { productId: "1", quantity: 1 },
        { productId: "2", quantity: 1 },
      ],
    };

    const result = await orderService.createOrder(createOrderCommand);

    expect(result.totalAmount).toBe(300); // No discounts applied
  });

  it("should handle location-based pricing correctly", async () => {
    const mockProducts = [
      { _id: "1", id: "1", price: 100, stock: 10, save: jest.fn() },
      { _id: "2", id: "2", price: 200, stock: 20, save: jest.fn() },
    ];

    jest
      .spyOn(productService, "findAllProductsByIds")
      .mockResolvedValue(mockProducts as any);

    const createOrderCommand = {
      continentCode: "AS" as keyof typeof continentCodeMap,
      customerId: "customer1",
      products: [
        { productId: "1", quantity: 1 },
        { productId: "2", quantity: 1 },
      ],
    };

    const result = await orderService.createOrder(createOrderCommand);

    expect(result.totalAmount).toBeLessThan(300); // Location-based pricing applied
  });
});
