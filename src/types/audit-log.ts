export type AuditLog = {
  id: string
  actorId?: string
  action: string
  resourceType: string
  resourceId?: string
  before?: unknown
  after?: unknown
  metadata: Record<string, unknown>
  createdAt: string
}

export type CreateAuditLogInput = {
  actorId?: string
  action: string
  resourceType: string
  resourceId?: string
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}
