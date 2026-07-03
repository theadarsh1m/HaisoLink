import { INotificationProvider, INotificationPayload } from "./INotificationProvider";
import { db } from "@/lib/db";

export class InAppProvider implements INotificationProvider {
  name = "IN_APP";

  async send(payload: INotificationPayload, to: string): Promise<boolean> {
    try {
      await db.notification.create({
        data: {
          userId: to,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          priority: payload.priority,
          orderId: payload.orderId,
        },
      });
      return true;
    } catch (error) {
      console.error(`[InAppProvider] Error:`, error);
      return false;
    }
  }
}
