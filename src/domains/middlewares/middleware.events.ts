/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events'
import Publisher from '../../tools/rabbit-mq/publisher'
import { queues } from '../../constants/queues'

const publisherFactory = Publisher.getInstance()

export enum SessionEvent {
  EMAIL_NOTIFICATION = 'email_notification',
  SMS_NOTIFICATION = 'sms_notification',
  PUSH_NOTIFICATION = 'push_notification',
}

// TODO: define the types for this class
class SessionEvents {
  private emitter = new EventEmitter()

  public emit(event: SessionEvent, data: any): void {
    this.emitter.emit(event, data)
  }

  public on(event: SessionEvent, listener: (data: any) => void): void {
    this.emitter.on(event, listener)
  }

  public off(event: SessionEvent, listener: (data: any) => void): void {
    this.emitter.off(event, listener)
  }
}

export const sessionEvents = new SessionEvents()

sessionEvents.on(SessionEvent.EMAIL_NOTIFICATION, async (data) => {
  data.bucket = 'email'
  await publisherFactory.publishMessage(queues.notifications, JSON.stringify(data))
  sessionEvents.off(SessionEvent.EMAIL_NOTIFICATION, () => void 0)
})

sessionEvents.on(SessionEvent.SMS_NOTIFICATION, async (data) => {
  data.type = 'sms'
  await publisherFactory.publishMessage(queues.notifications, JSON.stringify(data))
  sessionEvents.off(SessionEvent.SMS_NOTIFICATION, () => void 0)
})
