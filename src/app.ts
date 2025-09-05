import express from 'express';
import travelRoutes from './routes/travelRoutes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/travel-records', travelRoutes);

export default app;
