import { randomUUID } from 'crypto'
import { EventRepository } from '../repositories/event-repository'
import { EmulatorEvent } from '../types/events'

export class EventBus {
  constructor(
    private readonly eventRepository: EventRepository
  ) {}

  async publish(input: {
    event: EmulatorEvent['event']
    resourceType: EmulatorEvent['resourceType']
    resourceId: string
    payload: Record<string, unknown>
  }) {
    return this.eventRepository.add({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input
    })
  }
}
