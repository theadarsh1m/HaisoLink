import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class ZoneRepository {
  async findById(id: string) {
    return db.zone.findUnique({
      where: { id },
      include: {
        areas: true,
        agents: true,
      },
    });
  }

  async findByName(name: string) {
    return db.zone.findUnique({
      where: { name },
    });
  }

  async create(data: Prisma.ZoneCreateInput) {
    return db.zone.create({ data });
  }

  async update(id: string, data: Prisma.ZoneUpdateInput) {
    return db.zone.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.zone.delete({
      where: { id },
    });
  }

  async findAll() {
    return db.zone.findMany({
      include: {
        areas: true,
      },
    });
  }
}
