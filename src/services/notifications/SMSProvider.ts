import { INotificationProvider, INotificationPayload } from "./INotificationProvider";

export class SMSProvider implements INotificationProvider {
  name = "SMS";

  async send(payload: INotificationPayload, to: string): Promise<boolean> {
    try {
      console.log(`[SMSProvider] Sending SMS to ${to}...`);
      console.log(`[SMSProvider] Text: ${payload.title} - ${payload.message}`);
      return true;
    } catch (error) {
      console.error(`[SMSProvider] Error:`, error);
      return false;
    }
  }
}
