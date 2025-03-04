import express, { Application, Response, NextFunction } from 'express'
import helmet from 'helmet'
import path from 'path'
import cors from 'cors'
import swaggerDocs from './config/swagger.config'
import { env } from './config/env.config'
import { errorHandler } from './helpers/error-handler'
import morgan from 'morgan'
import { version } from '../package.json'

const app: Application = express()
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
)

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (_req, res: Response) => {
  res.status(200).json({
    message: 'Welcome to my boiler plate',
    data: {
      environment: env.ENVIRONMENT,
      version,
    },
  })
})

const PORT = env.PORT

swaggerDocs(app, parseInt(PORT))

// route registration
// app.use('')

app.use(errorHandler)

app.use((_req, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next()
  }
  res.status(404).json({
    message: 'Route not found',
    error: { message: 'Route not found' },
    success: false,
  })
})

export default app
