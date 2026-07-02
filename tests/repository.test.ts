import { UserRepository } from "../src/repositories/UserRepository";
import { ZoneRepository } from "../src/repositories/ZoneRepository";
import { AreaRepository } from "../src/repositories/AreaRepository";
import { RateCardRepository } from "../src/repositories/RateCardRepository";
import { OrderRepository } from "../src/repositories/OrderRepository";
import { AgentRepository } from "../src/repositories/AgentRepository";

async function runRepositoryTests() {
  const userRepo = new UserRepository();
  const zoneRepo = new ZoneRepository();
  const areaRepo = new AreaRepository();
  const rateRepo = new RateCardRepository();
  const orderRepo = new OrderRepository();
  const agentRepo = new AgentRepository();

  if (typeof userRepo.findById !== "function" || typeof userRepo.create !== "function") {
    throw new Error("UserRepository API mismatch");
  }

  if (typeof zoneRepo.findById !== "function" || typeof zoneRepo.create !== "function") {
    throw new Error("ZoneRepository API mismatch");
  }

  if (typeof areaRepo.findById !== "function" || typeof areaRepo.create !== "function") {
    throw new Error("AreaRepository API mismatch");
  }

  if (typeof rateRepo.findById !== "function" || typeof rateRepo.create !== "function") {
    throw new Error("RateCardRepository API mismatch");
  }

  if (typeof orderRepo.findById !== "function" || typeof orderRepo.create !== "function") {
    throw new Error("OrderRepository API mismatch");
  }

  if (typeof agentRepo.findById !== "function" || typeof agentRepo.create !== "function") {
    throw new Error("AgentRepository API mismatch");
  }

  console.log("Repositories API structures verified successfully");
}

runRepositoryTests().catch((e) => {
  console.error("Repository test failed:", e);
  process.exit(1);
});
