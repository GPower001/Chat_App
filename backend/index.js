import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './src/lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});