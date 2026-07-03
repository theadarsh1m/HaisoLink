import { db } from "@/lib/db";
import { NotificationType, NotificationChannel, NotificationPriority } from "@prisma/client";
import { INotificationProvider } from "./notifications/INotificationProvider";
import { EmailProvider } from "./notifications/EmailProvider";
import { SMSProvider } from "./notifications/SMSProvider";
import { InAppProvider } from "./notifications/InAppProvider";
import { NotificationTemplates, TemplateContext } from "./notifications/NotificationTemplates";

export class NotificationService {
  private providers: Record<string, INotificationProvider>;
  private maxRetries = 3;

  constructor() {
    this.providers = {
      EMAIL: new EmailProvider(),
      SMS: new SMSProvider(),
      IN_APP: new InAppProvider(),
    };
  }

  async dispatchEvent(
    userId: string,
    type: NotificationType,
    priority: NotificationPriority,
    context: TemplateContext,
    orderId?: string
  ): Promise<void> {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { notificationPreference: true },
    });

    if (!user) {
      console.warn(`[NotificationService] User ${userId} not found.`);
      return;
    }

    const prefs = user.notificationPreference || {
      emailEnabled: true,
      smsEnabled: true,
      inAppEnabled: true,
    };

    const template = NotificationTemplates.resolve(type, context);

    const channelsToSend: { channel: NotificationChannel; to: string }[] = [];

    if (prefs.emailEnabled && user.email) {
      channelsToSend.push({ channel: "EMAIL", to: user.email });
    }
    if (prefs.smsEnabled && user.phoneNumber) {
      channelsToSend.push({ channel: "SMS", to: user.phoneNumber });
    }
    if (prefs.inAppEnabled) {
      channelsToSend.push({ channel: "IN_APP", to: user.id });
    }

    for (const { channel, to } of channelsToSend) {
      this.sendWithRetry(channel, to, userId, type, priority, template.title, template.message, orderId).catch((err) => {
        console.error(`[NotificationService] Failed background send for ${channel}:`, err);
      });
    }
  }

  private async sendWithRetry(
    channel: NotificationChannel,
    to: string,
    userId: string,
    type: NotificationType,
    priority: NotificationPriority,
    title: string,
    message: string,
    orderId?: string
  ) {
    const provider = this.providers[channel];
    if (!provider) return;

    const payload = { userId, type, priority, title, message, orderId };
    
    let attempt = 0;
    let success = false;
    let lastError = "";

    while (attempt < this.maxRetries && !success) {
      attempt++;
      try {
        success = await provider.send(payload, to);
        if (!success) lastError = "Provider returned false";
      } catch (error: unknown) {
        success = false;
        if (error instanceof Error) {
          lastError = error.message;
        } else {
          lastError = "Unknown error";
        }
      }

      if (!success && attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    await db.notificationLog.create({
      data: {
        userId,
        orderId,
        notificationType: type,
        channel,
        provider: provider.name,
        status: success ? "SENT" : "FAILED",
        failureReason: success ? null : lastError,
        retryCount: attempt - 1,
        sentAt: success ? new Date() : null,
      },
    });
  }
}
