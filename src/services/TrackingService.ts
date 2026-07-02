import { OrderStatusType } from "@/constants";
import { TrackingHistory } from "@prisma/client";

export class TrackingService {
  async updateStatus(
    _orderId: string,
    _newStatus: OrderStatusType,
    _changedBy: string,
    _remarks?: string
  ): Promise<boolean> {
    throw new Error("Method not implemented");
  }

  async getTrackingHistory(_orderId: string): Promise<TrackingHistory[]> {
    throw new Error("Method not implemented");
  }
}
