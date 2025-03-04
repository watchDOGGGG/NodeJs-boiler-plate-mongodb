import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  MONGODB_DB_URL: z.string(),
  TEST_SERVICE_BASE_URL: z.string(),
  SERVICE_CONNECTION_TIMEOUT: z.string(),
  RABBIT_MQ_URL: z.string(),
  ENVIRONMENT: z.enum(['development', 'production', 'beta', 'staging']).default('development'),
})

const envSchemaValidation = envSchema.safeParse(process.env)

if (!envSchemaValidation.success) {
  console.log(envSchemaValidation.error.issues)
  process.exit(1)
}

export const env = envSchemaValidation.data
