import { db } from "@/lib/db";
import { NotificationType, NotificationStatus } from "@prisma/client";
import { EmailProvider } from "@/providers/EmailProvider";
import { BrevoProvider } from "@/providers/BrevoProvider";
import { logger } from "@/utils/logger";
import * as emailTemplates from "@/utils/emailTemplates";

export class NotificationService {
  private emailProvider: EmailProvider;
  private maxRetries = 3;

  constructor(provider?: EmailProvider) {
    this.emailProvider = provider || new BrevoProvider();
  }

  // Individual Email Dispatchers

  async sendOrderCreated(order: any, customer: any) {
    await this.dispatch("ORDER_CREATED", customer, order, async () => {
      return await emailTemplates.renderOrderCreatedHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
        pickupAddress: order.pickupArea?.areaName || "N/A",
        destinationAddress: order.destinationArea?.areaName || "N/A",
        weight: `${Math.max(order.actualWeight, order.volumetricWeight || 0)} kg`,
        totalCharges: `₹${order.totalCharge}`,
        orderDate: order.createdAt?.toLocaleDateString() || new Date().toLocaleDateString(),
      });
    }, "Your Order Has Been Created");
  }

  async sendOrderAssigned(order: any, customer: any, agent: any) {
    await this.dispatch("ORDER_ASSIGNED", customer, order, async () => {
      return await emailTemplates.renderOrderAssignedHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
        agentName: agent.user?.name || "Delivery Agent",
        vehicleType: agent.vehicleType || "Vehicle",
        estimatedPickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      });
    }, "Order Assigned to Courier");
  }

  async sendPickedUp(order: any, customer: any) {
    await this.dispatch("ORDER_PICKED_UP", customer, order, async () => {
      return await emailTemplates.renderPickedUpHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
      });
    }, "Order Picked Up");
  }

  async sendInTransit(order: any, customer: any) {
    await this.dispatch("ORDER_IN_TRANSIT", customer, order, async () => {
      return await emailTemplates.renderInTransitHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
      });
    }, "Order In Transit");
  }

  async sendOutForDelivery(order: any, customer: any, agent: any) {
    await this.dispatch("ORDER_OUT_FOR_DELIVERY", customer, order, async () => {
      return await emailTemplates.renderOutForDeliveryHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
        estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
        agentName: agent?.user?.name || "Courier",
        contactNumber: agent?.user?.phoneNumber || "N/A",
      });
    }, "Order Out For Delivery");
  }

  async sendDelivered(order: any, customer: any, proof: any) {
    await this.dispatch("ORDER_DELIVERED", customer, order, async () => {
      return await emailTemplates.renderDeliveredHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
        deliveryTime: new Date().toLocaleTimeString(),
        recipientName: proof.recipientName,
        deliveryNotes: proof.notes || "",
      });
    }, "Order Delivered Successfully");
  }

  async sendDeliveryFailed(order: any, customer: any, reason: string, notes?: string) {
    await this.dispatch("ORDER_FAILED", customer, order, async () => {
      return await emailTemplates.renderDeliveryFailedHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
        failureReason: reason,
        agentNotes: notes,
      });
    }, "Delivery Attempt Failed");
  }

  async sendRescheduled(order: any, customer: any, newDate: Date) {
    await this.dispatch("ORDER_RESCHEDULED", customer, order, async () => {
      return await emailTemplates.renderRescheduledHtml({
        customerName: customer.companyName || customer.user?.name || "Customer",
        trackingNumber: order.trackingNumber,
        newDeliveryDate: newDate.toLocaleDateString(),
      });
    }, "Delivery Rescheduled");
  }


  /**
   * Core dispatcher handling user lookup, HTML generation, and retries.
   */
  private async dispatch(
    type: NotificationType, 
    customer: any, 
    order: any, 
    renderHtml: () => Promise<string>,
    subject: string
  ) {
    try {
      const user = customer?.user;
      if (!user?.email) {
        logger.warn(`No email address found for customer ID: ${customer?.id}. Skipping email.`);
        return;
      }

      // Generate HTML from React Email
      const html = await renderHtml();

      // Execute send with retry logic in background to prevent blocking order flow
      this.sendWithRetry(user.id, user.email, subject, html, type, order.id).catch((err) => {
        logger.error(`[NotificationService] Uncaught background error: ${err.message}`);
      });

    } catch (err: any) {
      // Catch any template rendering or user fetching errors gracefully
      logger.error(`[NotificationService] Failed to prepare email ${type} for order ${order?.id}: ${err.message}`);
    }
  }

  /**
   * Resilient send implementation with exponential backoff retries.
   */
  private async sendWithRetry(
    userId: string,
    to: string,
    subject: string,
    html: string,
    type: NotificationType,
    orderId?: string
  ) {
    let attempt = 0;
    let success = false;
    let lastError = "";

    while (attempt < this.maxRetries && !success) {
      attempt++;
      try {
        await this.emailProvider.sendEmail({ to, subject, html });
        success = true;
      } catch (error: any) {
        success = false;
        lastError = error.message || "Unknown error";
        logger.warn(`[NotificationService] Attempt ${attempt} failed for ${type} to ${to}: ${lastError}`);
        
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    if (success) {
      logger.info(`[NotificationService] Successfully sent ${type} email to ${to} for order ${orderId}`);
    } else {
      logger.error(`[NotificationService] Permanently failed to send ${type} email to ${to} after ${this.maxRetries} attempts. Reason: ${lastError}`);
    }

    // Persist to database history
    try {
      await db.notificationLog.create({
        data: {
          userId,
          orderId,
          notificationType: type,
          channel: "EMAIL",
          provider: "Brevo",
          status: success ? NotificationStatus.SENT : NotificationStatus.FAILED,
          failureReason: success ? null : lastError,
          retryCount: attempt - 1,
          sentAt: success ? new Date() : null,
        },
      });
    } catch (dbError: any) {
      logger.error(`[NotificationService] Failed to log notification to database: ${dbError.message}`);
    }
  }
}
