import { Expose } from "class-transformer";
import { IsDefined, IsNumber, Min } from "class-validator";

export class RestockProductDto {
  @Expose()
  @IsDefined()
  @IsNumber()
  @Min(0)
  amount: number;
}
