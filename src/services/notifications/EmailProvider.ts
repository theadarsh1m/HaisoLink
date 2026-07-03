import { INotificationProvider, INotificationPayload } from "./INotificationProvider";

export class EmailProvider implements INotificationProvider {
  name = "EMAIL";

  async send(payload: INotificationPayload, to: string): Promise<boolean> {
    try {
      console.log(`[EmailProvider] Sending Email to ${to}...`);
      console.log(`[EmailProvider] Subject: ${payload.title}`);
      console.log(`[EmailProvider] Body: ${payload.message}`);
      return true;
    } catch (error) {
      console.error(`[EmailProvider] Error:`, error);
      return false;
    }
  }
}
