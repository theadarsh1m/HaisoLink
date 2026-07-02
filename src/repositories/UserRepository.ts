import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class UserRepository {
  async findById(id: string) {
    return db.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        customerProfile: true,
        deliveryAgentProfile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        customerProfile: true,
        deliveryAgentProfile: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return db.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return db.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async findAll() {
    return db.user.findMany({
      where: { deletedAt: null },
    });
  }
}
