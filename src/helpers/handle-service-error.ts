import { isAxiosError } from 'axios'
import { throwError } from './throw-error'
import { logger } from './logger'

export const handleServiceError = (error: unknown, logMessage = '', service: string) => {
  if (isAxiosError(error)) {
    if (!error.response) {
      logger.error(`${logMessage}: ${error.message}`, service, { error: error.message })
      return throwError(500, {
        message: 'Service unavailable',
      })
    }

    const message = error.response?.data.message || error.message
    logger.error(`${logMessage}: ${message}`, service)
    return throwError(error.response?.status ?? 500, {
      message,
      errors: error.response?.data?.errors,
    })
  }

  if (error instanceof Error) {
    return throwError(500, {
      message: error.message,
    })
  }

  return throwError(500, {
    message: 'Internal server error',
  })
}
