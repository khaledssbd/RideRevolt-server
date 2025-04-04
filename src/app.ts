import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
// import os from 'os';
// import httpStatus from 'http-status';

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

// app.get('/', (req: Request, res: Response) => {
//   const currentDateTime = new Date().toISOString();
//   const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//   const serverHostname = os.hostname();
//   const serverPlatform = os.platform();
//   const serverUptime = os.uptime();

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Hi, Welcome to RideRevolt! 🚴  ✨  ⚡',
//     version: '1.0.0',
//     clientDetails: {
//       ipAddress: clientIp,
//       accessedAt: currentDateTime,
//     },
//     serverDetails: {
//       hostname: serverHostname,
//       platform: serverPlatform,
//       uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor(
//         (serverUptime / 60) % 60,
//       )} minutes`,
//     },
//     developerContact: {
//       email: 'khaledssbd@gmail.com',
//       website: 'https://khaled-siddique.vercel.app',
//     },
//   });
// });

// all routes
app.use('/api/v1', router);

// global error handler
app.use(globalErrorHandler);

// not found route handler
app.use(notFound);

export default app;
