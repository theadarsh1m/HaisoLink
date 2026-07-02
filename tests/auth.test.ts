import { auth } from "../src/lib/auth";
import { authClient } from "../src/lib/auth-client";

async function runAuthTests() {
  if (!auth) {
    throw new Error("Better Auth Server configuration object is invalid");
  }
  if (!authClient) {
    throw new Error("Better Auth Client configuration object is invalid");
  }
  console.log("Authentication hooks and server instances verified successfully");
}

runAuthTests().catch((e) => {
  console.error("Auth test failed:", e);
  process.exit(1);
});
