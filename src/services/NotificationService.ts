export class NotificationService {
  async createNotification(
    _userId: string,
    _title: string,
    _message: string,
    _type: "ORDER_ASSIGNED" | "ORDER_STATUS_UPDATE" | "SYSTEM_ALERT" | "ZONE_WARNING"
  ): Promise<boolean> {
    throw new Error("Method not implemented");
  }

  async sendPushNotification(_userId: string, _title: string, _message: string): Promise<boolean> {
    throw new Error("Method not implemented");
  }

  async sendEmail(_email: string, _subject: string, _content: string): Promise<boolean> {
    throw new Error("Method not implemented");
  }
}
