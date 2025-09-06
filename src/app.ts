import express, { Request, Response, NextFunction } from 'express';
import travelRoutes from './routes/travelRoutes';
import { HTTPError } from './middleware/httpError';
import { setupDocs } from './routes/docs';

const app = express();

app.use(express.json());

app.use('/api/travel-records', travelRoutes);

setupDocs(app);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof HTTPError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;
