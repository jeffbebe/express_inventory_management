import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
  Min,
} from "class-validator";
import { Product } from "./product.model";
import { Expose } from "class-transformer";

export class CreateProductDto implements Product {
  @Expose()
  @IsDefined()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsDefined()
  @MaxLength(50)
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsDefined()
  @IsPositive()
  price: number;

  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  stock: number;
}
