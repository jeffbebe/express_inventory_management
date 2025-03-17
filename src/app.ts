import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { productRouter } from "./api/product/routes/product.routes";
import { orderRouter } from "./api/order/routes/order.routes";
import { notFoundHandler } from "./common/middleware/not-found";
import errorHandler from "./common/middleware/error-handler";
import { env } from "./common/utils/env.config";

const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

app.use("/products", productRouter);
app.use("/orders", orderRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
