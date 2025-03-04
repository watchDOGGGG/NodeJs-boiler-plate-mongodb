import * as amqp from 'amqplib'
import { env } from '../../config/env.config'

class Consumer {
  private channel: amqp.Channel = {} as amqp.Channel
  private connection: amqp.Connection = {} as amqp.Connection

  constructor() {
    this.init()
  }

  private async init() {
    try {
      this.connection = await amqp.connect(env.RABBIT_MQ_URL)
      this.channel = await this.connection.createChannel()
    } catch (error) {
      console.log(error)
    }
  }

  public async consumeMessage(queueName: string, callback: (message: amqp.ConsumeMessage | null) => void) {
    if (Object.keys(this.channel).length === 0 || Object.keys(this.connection).length === 0) {
      await this.init()
    }

    await this.channel.assertQueue(queueName, { durable: true })
    this.channel.consume(queueName, (message) => {
      if (message) {
        console.log(`Message received: ${message.content.toString()}`)
        callback(message)
        this.channel.ack(message)
      }
    })
  }

  private async close() {
    if (Object.keys(this.channel).length === 0 || Object.keys(this.connection).length === 0) {
      return
    }

    if (this.connection) {
      await this.channel.close()
      this.channel = {} as amqp.Channel
      await this.connection.close()
      this.connection = {} as amqp.Connection
    }
  }
}

export default Consumer
