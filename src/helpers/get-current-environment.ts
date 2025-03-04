import { env } from '../config/env.config'

export class GetEnvironMent {
  public static isDevelopment() {
    return env.ENVIRONMENT === 'development'
  }

  public static isProduction() {
    return env.ENVIRONMENT === 'production'
  }
}
