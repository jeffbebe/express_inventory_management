import { NextFunction, Request, Response } from "express";
import { CreateProductCommand } from "../commands/createProduct.command";
import { RestockProductCommand } from "../commands/restockProduct.command";
import { SellProductCommand } from "../commands/sellProduct.command";
import { GetProductsQuery } from "../queries/getProducts.query";
import { CreateProductDto } from "../models/create-product.dto";
import { CreateProductHandler } from "../handlers/createProduct.handler";
import { GetProductsHandler } from "../handlers/getProducts.handler";
import { RestockProductHandler } from "../handlers/restockProduct.handler";
import { SellProductHandler } from "../handlers/sellProduct.handler";
import { validateRequestPayload } from "../../../common/middleware/validate-body.validator";
import { isMongoId } from "class-validator";
import { BadRequestException } from "../../../common/errors/bad-request.error";
import { RestockProductDto } from "../models/restock-product.dto";
import { SellProductDto } from "../models/sell-product.dto";

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price, stock } = await validateRequestPayload(
        CreateProductDto,
        "body",
        req
      );

      const command = new CreateProductCommand(name, description, price, stock);
      const handler = new CreateProductHandler();

      const product = await handler.execute(command);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = new GetProductsQuery();
      const handler = new GetProductsHandler();

      const products = await handler.execute(query);
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }

  async restockProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) {
        throw new BadRequestException({
          message: "Id must be a valid mongo id",
        });
      }

      const { amount } = await validateRequestPayload(
        RestockProductDto,
        "body",
        req
      );

      const command = new RestockProductCommand(id, amount);
      const handler = new RestockProductHandler();

      await handler.execute(command);
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }

  async sellProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!isMongoId(id)) {
        throw new BadRequestException({
          message: "Id must be a valid mongo id",
        });
      }

      const { amount } = await validateRequestPayload(
        SellProductDto,
        "body",
        req
      );

      const command = new SellProductCommand(id, amount);
      const handler = new SellProductHandler();

      await handler.execute(command);

      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }
}
