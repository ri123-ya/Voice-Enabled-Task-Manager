import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';
import connectDB from './connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Voice-Enabled Task Manager API is running');
});

// MongoDB Connection
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});