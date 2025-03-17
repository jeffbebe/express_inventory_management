import { continentCodeMap } from "../models/continentCode.model";

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly products: { productId: string; quantity: number }[],
    public readonly continentCode: keyof typeof continentCodeMap
  ) {}
}
