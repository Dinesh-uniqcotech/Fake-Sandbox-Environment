import { randomUUID } from 'crypto'
import { prisma } from '../database/prisma'
import {
  AuditLog,
  CreateAuditLogInput
} from '../types/audit-log'

const toIso = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value

const mapAuditLog = (log: any): AuditLog => ({
  ...log,
  actorId: log.actorId ?? undefined,
  resourceId: log.resourceId ?? undefined,
  before: log.before ?? undefined,
  after: log.after ?? undefined,
  metadata:
    typeof log.metadata === 'object' && log.metadata !== null
      ? log.metadata
      : {},
  createdAt: toIso(log.createdAt)
})

export class AuditLogRepository {
  async add(input: CreateAuditLogInput) {
    const saved = await prisma.auditLog.create({
      data: {
        id: randomUUID(),
        actorId: input.actorId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        before: input.before as any,
        after: input.after as any,
        metadata: (input.metadata ?? {}) as any
      }
    })

    return mapAuditLog(saved)
  }

  async findAll() {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return logs.map(mapAuditLog)
  }
}
