import app from './app'
import dotenv from 'dotenv'
import { env } from './config/env.config'
import { connectToDB } from './config/mongoose.config'

dotenv.config()

const PORT = env.PORT

connectToDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
