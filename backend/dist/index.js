import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToDb } from './db/db.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
const app = express();
const port = process.env.PORT;
// Db connection
connectToDb();
// middlewares
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
