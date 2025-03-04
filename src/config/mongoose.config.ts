import mongoose from 'mongoose'
import { env } from './env.config'
import { logger } from '../helpers/logger'

const { MONGODB_DB_URL } = env

const connectionUrl = MONGODB_DB_URL

mongoose.set('strictQuery', true)

const connectToDB = async (cb?: () => void) => {
  await mongoose
    .connect(connectionUrl)
    .then(() => {
      cb?.()
      logger.info('Connected to database')
    })
    .catch((error: Error) => {
      logger.error(`Error connecting to database: ${error.message}`)
    })
}

export { connectToDB }
