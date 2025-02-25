import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

const corsConfig = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://riderevolt-frontend.vercel.app',
  ],
  credentials: true,
};

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.get('/', (req: Request, res: Response) => {
  res.send('Hi, Welcome to RideRevolt! 🚴  ✨  ⚡');
});

// all routes
app.use('/api', router);

// global error handler
app.use(globalErrorHandler);

// not found route handler
app.use(notFound);

export default app;
