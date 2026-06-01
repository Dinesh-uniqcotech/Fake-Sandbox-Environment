import { AuditLogRepository } from './audit-log-repository'
import { EmulatorEvent } from '../types/events'

export class EventRepository {
  constructor(
    private readonly auditLogs: AuditLogRepository
  ) {}

  async add(event: EmulatorEvent) {
    await this.auditLogs.add({
      action: event.event,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      after: event.payload,
      metadata: {
        eventId: event.id,
        source: 'event-bus'
      }
    })

    return event
  }

  async findAll() {
    const logs = await this.auditLogs.findAll()

    return logs
      .filter(log => log.metadata.source === 'event-bus')
      .map(log => ({
        id: String(log.metadata.eventId ?? log.id),
        event: log.action as EmulatorEvent['event'],
        resourceType:
          log.resourceType as EmulatorEvent['resourceType'],
        resourceId: log.resourceId ?? '',
        payload:
          typeof log.after === 'object' &&
          log.after !== null &&
          !Array.isArray(log.after)
            ? (log.after as Record<string, unknown>)
            : {},
        createdAt: log.createdAt
      }))
  }
}
