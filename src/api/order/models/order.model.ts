import mongoose, { Schema, Document, MergeType } from "mongoose";

interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  customerId: string;
  products: OrderProduct[];
  totalAmount: number;
  createdAt: Date;
}

export interface OrderDocument extends MergeType<Order, Document> {}

const OrderSchema = new Schema<OrderDocument>({
  customerId: { type: String, required: true },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
