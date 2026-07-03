import { NotificationTemplates } from "../src/services/notifications/NotificationTemplates";

async function testNotificationSystem() {
  console.log("=== Testing Notification System ===");

  const templateContext = {
    customerName: "Jane Doe",
    trackingNumber: "HL-9999",
    agentName: "Agent Smith",
    vehicleType: "Van",
    amount: "150",
  };

  const createdTemplate = NotificationTemplates.resolve("ORDER_CREATED", templateContext);
  console.log("ORDER_CREATED Title:", createdTemplate.title);
  if (createdTemplate.title !== "Your Order Has Been Created") throw new Error("Template failure");

  const assignedTemplate = NotificationTemplates.resolve("ORDER_ASSIGNED", templateContext);
  console.log("ORDER_ASSIGNED Title:", assignedTemplate.title);
  if (!assignedTemplate.message.includes("Agent Smith")) throw new Error("Template failure");

  console.log("✔ Templates resolved successfully.");
}

testNotificationSystem().catch(console.error);
