import express, { Application, Request, Response } from 'express';
import cardRoutes from './routes/card.routes';
import { errorHandler } from './middleware/error-handler';

const app: Application = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Main API Routes
app.use('/', cardRoutes);

// Catch-all 404 Handler for unmatched routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export default app;
