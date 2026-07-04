import { BrevoProvider } from "./src/providers/BrevoProvider";
import { NotificationService } from "./src/services/NotificationService";

async function run() {
  console.log("Testing Brevo Provider...");
  const provider = new BrevoProvider();
  
  try {
    await provider.sendEmail({
      to: "test@example.com", // Dummy email
      subject: "Test from HaisoLink",
      html: "<p>Hello World</p>"
    });
    console.log("Sent successfully!");
  } catch (e) {
    console.error("Failed to send:", e);
  }
}
run();
