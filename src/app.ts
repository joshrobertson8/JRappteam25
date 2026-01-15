import express from 'express';
import { travelRoutes } from './modules/travel';
import { setupDocs } from './docs';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api/travel-records', travelRoutes);

setupDocs(app);

app.use(errorHandler);

export default app;
