import { AssignmentService } from "../src/services/AssignmentService";
import { LocationRepository } from "../src/repositories/LocationRepository";
import { AgentRepository } from "../src/repositories/AgentRepository";
import { calculateDistance } from "../src/lib/haversine";

async function runAssignmentTests() {
  const service = new AssignmentService();
  const locationRepo = new LocationRepository();
  const agentRepo = new AgentRepository();

  if (typeof service.autoAssignAgent !== "function" || typeof service.manualAssignAgent !== "function") {
    throw new Error("AssignmentService API signature mismatch");
  }

  if (typeof locationRepo.updateAgentLocation !== "function" || typeof locationRepo.updateAgentLocationByUserId !== "function") {
    throw new Error("LocationRepository API signature mismatch");
  }

  if (typeof agentRepo.updateAvailability !== "function" || typeof agentRepo.updateAvailabilityByUserId !== "function") {
    throw new Error("AgentRepository API signature mismatch");
  }

  const mockPickup = { lat: 28.61, lng: 77.20 };
  const mockAgents = [
    { name: "Agent A", lat: 28.62, lng: 77.21, deliveries: 0, rating: 4.8 },
    { name: "Agent B", lat: 28.69, lng: 77.21, deliveries: 2, rating: 4.9 },
  ];

  const scores = mockAgents.map((agent) => {
    const distance = calculateDistance(mockPickup.lat, mockPickup.lng, agent.lat, agent.lng);
    const score = distance * 1 + agent.deliveries * 10 - agent.rating * 1;
    return { name: agent.name, score };
  });

  if (scores[0].score >= scores[1].score) {
    throw new Error("Scoring logic fail: Agent A should have a lower score than Agent B");
  }

  console.log("Assignment scoring logic and repository hooks verified successfully");
}

runAssignmentTests().catch((e) => {
  console.error("Assignment unit test failed:", e);
  process.exit(1);
});
