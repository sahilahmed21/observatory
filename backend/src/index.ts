import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.get('/', (req: Request, res: Response) => {
    res.send('Observatory API is running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
