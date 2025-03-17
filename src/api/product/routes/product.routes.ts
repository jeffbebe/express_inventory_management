import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

export const productRouter = Router();
const productController = new ProductController();

productRouter.get("/", productController.getProducts);
productRouter.post("/", productController.createProduct);
productRouter.post("/:id/restock", productController.restockProduct);
productRouter.post("/:id/sell", productController.sellProduct);
