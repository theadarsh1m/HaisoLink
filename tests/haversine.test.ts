import { calculateDistance } from "../src/lib/haversine";

async function runHaversineTests() {
  const distanceSame = calculateDistance(40.7128, -74.006, 40.7128, -74.006);
  if (Math.abs(distanceSame) > 0.0001) {
    throw new Error("Distance between identical points should be 0");
  }

  const distanceNYCtoLA = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
  const expectedDistance = 3936;
  if (Math.abs(distanceNYCtoLA - expectedDistance) > 100) {
    throw new Error(`NYC to LA distance mismatch: calculated ${distanceNYCtoLA}, expected ~${expectedDistance}`);
  }

  console.log("Haversine formula unit tests passed successfully");
}

runHaversineTests().catch((e) => {
  console.error("Haversine test failed:", e);
  process.exit(1);
});
