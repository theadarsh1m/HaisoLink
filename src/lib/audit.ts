import { db } from "@/lib/db";

interface AuditLogParams {
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    await db.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        oldValue: params.oldValue,
        newValue: params.newValue,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // We intentionally don't throw to prevent audit logging failures from crashing the main transaction
  }
}
