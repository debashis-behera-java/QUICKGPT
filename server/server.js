import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'
import serverless from 'serverless-http'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

let isConnected = false
async function ensureDB() {
  if (!isConnected) {
    await connectDB()
    isConnected = true
  }
}

app.use(async (req, res, next) => {
  await ensureDB()
  next()
})

export const handler = serverless(app)

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
