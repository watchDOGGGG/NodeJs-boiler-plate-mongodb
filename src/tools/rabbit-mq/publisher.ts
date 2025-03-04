import * as amqp from 'amqplib'
import { env } from '../../config/env.config'

class Publisher {
  private static instance: Publisher | null = null
  private channel: amqp.Channel | null = null
  private connection: amqp.Connection | null = null

  public static getInstance(): Publisher {
    if (!this.instance) {
      this.instance = new Publisher()
      this.instance.init()
    }
    return this.instance
  }

  private async init(retryCount = 0) {
    try {
      if (retryCount >= 3) {
        console.error('Maximum retry count reached. Aborting initialization.')
        return
      }

      if (!this.connection || !this.isConnectionOpen(this.connection)) {
        this.connection = await amqp.connect(env.RABBIT_MQ_URL)
        this.channel = await this.connection.createChannel()
      }
    } catch (error: unknown) {
      console.error('Error initializing connection:', (error as Error).message)
      await this.init(retryCount + 1)
    }
  }

  private isConnectionOpen(connection: amqp.Connection | null): boolean {
    return !!connection && connection?.['close'] === undefined
  }

  public async publishMessage(queueName: string, message: string) {
    if (!this.connection || !this.isConnectionOpen(this.connection)) {
      await this.init()
    }

    if (!this.channel) {
      console.error('Channel is not initialized')
      return
    }

    try {
      await this.channel.assertQueue(queueName, { durable: false })
      await this.channel.sendToQueue(queueName, Buffer.from(message))
      console.log('Message published successfully')
    } catch (error: unknown) {
      console.error('Error publishing message:', (error as Error).message)
    }
  }

  public async close() {
    if (this.connection && this.isConnectionOpen(this.connection)) {
      try {
        this.channel && (await this.channel.close())
        this.channel = null
        await this.connection.close()
        this.connection = null
      } catch (error: unknown) {
        console.error('Error closing connection:', (error as Error).message)
      }
    }
  }
}

export default Publisher
