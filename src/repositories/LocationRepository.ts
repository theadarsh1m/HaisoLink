import { db } from "@/lib/db";

export class LocationRepository {
  async updateAgentLocation(agentProfileId: string, latitude: number, longitude: number) {
    return db.deliveryAgentProfile.update({
      where: { id: agentProfileId },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastLocationUpdate: new Date(),
      },
    });
  }

  async updateAgentLocationByUserId(userId: string, latitude: number, longitude: number) {
    return db.deliveryAgentProfile.update({
      where: { userId },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastLocationUpdate: new Date(),
      },
    });
  }
}
