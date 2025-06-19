import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.mjs';
import electionRoutes from './routes/electionRoutes.mjs';
import contractRoutes from './routes/contractRoutes.mjs';
import publicKeyRoute from './routes/keyRoute.mjs';
import userRoutes from './routes/userRoutes.mjs';
import paymentRoutes from './routes/paymentRoutes.mjs';
import errorMiddleware from "./middleware/errorMiddleware.mjs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads/candidates', express.static(path.join(__dirname, 'public', 'uploads', 'candidates')));
app.use('/candidates', express.static(path.join(__dirname, 'public', 'uploads', 'candidates')));

app.use('/api/auth', authRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api', publicKeyRoute);
app.use(errorMiddleware);

export default app;
