import { OrderInput } from "@/validations/order";

export class OrderService {
  async createOrder(_customerId: string, _data: OrderInput): Promise<string> {
    throw new Error("Method not implemented");
  }

  async cancelOrder(_orderId: string, _remarks: string): Promise<boolean> {
    throw new Error("Method not implemented");
  }
}
