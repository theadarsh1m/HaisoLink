import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class AreaRepository {
  async findById(id: string) {
    return db.area.findUnique({
      where: { id },
      include: {
        zone: true,
      },
    });
  }

  async findByPincode(pincode: string) {
    return db.area.findMany({
      where: { pincode },
    });
  }

  async create(data: Prisma.AreaCreateInput) {
    return db.area.create({ data });
  }

  async update(id: string, data: Prisma.AreaUpdateInput) {
    return db.area.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.area.delete({
      where: { id },
    });
  }

  async findAll() {
    return db.area.findMany({
      include: {
        zone: true,
      },
    });
  }
}
