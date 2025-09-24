import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import metricsRouter from './routes/metrics.routes';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import { setupWebSocketServer, connectRedisSubscriber } from './websocket';
import alertRouter from './routes/alert.routes';
import statsRouter from './routes/stats.routes';
import { createObservatoryAgent } from 'observatory-agent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: [
        'http://localhost:3000', // For local development
        process.env.FRONTEND_URL || '' // For our future Vercel deployment
    ],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/projects/:projectId/alerts', alertRouter);
app.use('/api/projects/:projectId/stats', statsRouter);


app.get('/', (req: Request, res: Response) => {
    res.send('Observatory API is running! 🚀');
});

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);

    setupWebSocketServer(server);

    connectRedisSubscriber();
});
