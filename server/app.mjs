import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.mjs'

const app = express()

// Fix the CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}

// Apply CORS middleware
app.use(cors(corsOptions))
app.use(express.json())

// Fix the route path with a leading slash
app.use("/api/auth", authRoutes)

export default app