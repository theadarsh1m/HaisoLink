import { NotificationType } from "@prisma/client";

export interface TemplateContext {
  customerName?: string;
  trackingNumber?: string;
  amount?: string;
  agentName?: string;
  vehicleType?: string;
  reason?: string;
  requestedDate?: string;
  status?: string;
}

export interface ResolvedTemplate {
  title: string;
  message: string;
}

export class NotificationTemplates {
  static resolve(type: NotificationType, context: TemplateContext): ResolvedTemplate {
    switch (type) {
      case "ORDER_CREATED":
        return {
          title: "Your Order Has Been Created",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber || "unknown"} has been created successfully.\n\nCurrent Status:\nCreated\n\nTotal Charge:\n₹${context.amount || "0"}\n\nThank you.`,
        };
      case "ORDER_ASSIGNED":
        return {
          title: "Order Assigned to Courier",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} has been assigned to ${context.agentName} (${context.vehicleType}). They will be arriving shortly.`,
        };
      case "ORDER_PICKED_UP":
        return {
          title: "Order Picked Up",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} has been picked up by the courier and is now in transit.`,
        };
      case "ORDER_IN_TRANSIT":
        return {
          title: "Order In Transit",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} is currently in transit to the destination.`,
        };
      case "ORDER_OUT_FOR_DELIVERY":
        return {
          title: "Order Out For Delivery",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} is out for delivery today. Please make sure someone is available to receive it.`,
        };
      case "ORDER_DELIVERED":
        return {
          title: "Order Delivered Successfully",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} has been delivered successfully. Thank you for choosing us!`,
        };
      case "ORDER_FAILED":
        return {
          title: "Delivery Attempt Failed",
          message: `Hi ${context.customerName || "Customer"},\n\nWe attempted to deliver your order ${context.trackingNumber} but failed. Reason: ${context.reason || "Not available"}. You can reschedule it from your dashboard.`,
        };
      case "ORDER_RESCHEDULED":
        return {
          title: "Delivery Rescheduled",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} has been rescheduled to ${context.requestedDate || "a new date"}. Reason: ${context.reason || "Customer request"}.`,
        };
      case "ORDER_CANCELLED":
        return {
          title: "Order Cancelled",
          message: `Hi ${context.customerName || "Customer"},\n\nYour order ${context.trackingNumber} has been cancelled.`,
        };
      default:
        return {
          title: "System Update",
          message: `An update has occurred for your order.`,
        };
    }
  }
}
