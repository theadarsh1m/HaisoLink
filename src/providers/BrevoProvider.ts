import { EmailProvider } from "./EmailProvider";
import { EmailOptions } from "@/types/Email";
import { brevoClient } from "@/lib/brevo";

export class BrevoProvider implements EmailProvider {
  async sendEmail(options: EmailOptions): Promise<void> {
    const emailConfig: any = {
      subject: options.subject,
      htmlContent: options.html,
      sender: {
        name: process.env.EMAIL_FROM_NAME || "HaiSoLink Logistics",
        email: process.env.EMAIL_FROM || "noreply@example.com",
      },
    };

    // Handle single or multiple recipients
    if (Array.isArray(options.to)) {
      emailConfig.to = options.to.map((email) => ({ email }));
    } else {
      emailConfig.to = [{ email: options.to }];
    }

    if (options.replyTo) {
      emailConfig.replyTo = { email: options.replyTo };
    }

    if (options.cc && options.cc.length > 0) {
      emailConfig.cc = options.cc.map((email) => ({ email }));
    }

    if (options.bcc && options.bcc.length > 0) {
      emailConfig.bcc = options.bcc.map((email) => ({ email }));
    }

    try {
      await brevoClient.transactionalEmails.sendTransacEmail(emailConfig);
    } catch (error: any) {
      // Re-throw the error so the caller (NotificationService) can handle retry logic
      throw new Error(`Brevo API Error: ${error.message || "Unknown error"}`);
    }
  }
}
