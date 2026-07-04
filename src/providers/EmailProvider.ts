import { EmailOptions } from "@/types/Email";

export interface EmailProvider {
  /**
   * Send an email with the specified options
   * @param options The email configuration (to, subject, html, etc)
   */
  sendEmail(options: EmailOptions): Promise<void>;
}
