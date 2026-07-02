export class PricingService {
  async calculatePrice(
    _weight: number,
    _sourceZoneId: string,
    _destinationZoneId: string,
    _orderType: "STANDARD" | "EXPRESS",
    _useCOD: boolean
  ): Promise<number> {
    throw new Error("Method not implemented");
  }
}
