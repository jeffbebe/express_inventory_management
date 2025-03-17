import { NextFunction, Request, Response } from "express";
import { CreateOrderCommand } from "../commands/createOrder.command";
import { GetOrdersQuery, GetOrdersHandler } from "../queries/getOrders.query";
import axios from "axios";
import { continentCodeMap } from "./../models/continentCode.model";
import { validateRequestPayload } from "../../../common/middleware/validate-body.validator";
import { CreateOrderDto } from "../models/create-order.dto";
import { CreateOrderHandler } from "../handlers/createOrder.handler";

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId, products } = await validateRequestPayload(
        CreateOrderDto,
        "body",
        req
      );

      const userIp = req.ip || req.headers["x-forwarded-for"];

      // free IP geolocation API
      const response = await axios.get<{
        continent_code: keyof typeof continentCodeMap;
      }>(`https://ipapi.co/${userIp}/json/`);
      const continentCode = response.data.continent_code;

      const command = new CreateOrderCommand(
        customerId,
        products,
        continentCode
      );
      const handler = new CreateOrderHandler();

      const order = await handler.execute(command);

      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  async getOrders(req: Request, res: Response) {
    const query = new GetOrdersQuery();
    const handler = new GetOrdersHandler();

    const orders = await handler.execute();
    res.json(orders);
  }
}
