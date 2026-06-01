import { AuditLogRepository } from './audit-log-repository'

export type RequestLogEntry = {
  method: string
  url: string
  timestamp: string
  responseTimeMs: number
  statusCode: number
}

export class RequestLogRepository {
  constructor(
    private readonly auditLogs: AuditLogRepository
  ) {}

  async append(entry: RequestLogEntry) {
    await this.auditLogs.add({
      action: 'HTTP_REQUEST',
      resourceType: 'request',
      resourceId: `${entry.method} ${entry.url}`,
      metadata: {
        ...entry,
        source: 'request-logger'
      }
    })
  }
}
