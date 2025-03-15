import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.mjs'
import electionRoutes from './routes/electionRoutes.mjs'

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/election", electionRoutes)
app.use("/api/candidates",authRoutes)

export default app