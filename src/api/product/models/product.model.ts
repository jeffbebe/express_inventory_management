import mongoose, { Schema, Document, MergeType } from "mongoose";

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductDocument extends MergeType<Product, Document> {}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 50, unique: true },
  description: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
});

export const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  ProductSchema
);
