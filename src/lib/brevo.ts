import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.warn("BREVO_API_KEY is not defined. Email dispatch will fail.");
}

export const brevoClient = new BrevoClient({ apiKey: apiKey || "dummy_key_to_prevent_crash" });

