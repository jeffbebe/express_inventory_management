import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";

class OrderProduct {
  @Expose()
  @IsMongoId()
  productId: string;

  @Expose()
  @IsDefined()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @Expose()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @Expose()
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderProduct)
  products: OrderProduct[];
}
