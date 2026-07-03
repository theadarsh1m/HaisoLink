import { NotificationType, NotificationPriority } from "@prisma/client";

export interface INotificationPayload {
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  orderId?: string;
}

export interface INotificationProvider {
  name: string;
  send(payload: INotificationPayload, to: string): Promise<boolean>;
}
