import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.mjs'
import electionRoutes from './routes/electionRoutes.mjs'
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express()
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads/candidates', express.static(path.join(__dirname, 'public', 'uploads', 'candidates')));
app.use('/candidates', express.static(path.join(__dirname, 'public', 'uploads', 'candidates')));
app.use(cookieParser())
console.log(path.join(__dirname, 'public', 'uploads'));

app.use("/api/auth", authRoutes)
app.use("/api/election", electionRoutes)

export default app