import AgentAPI from 'apminsight';
AgentAPI.config()

import 'dotenv/config';
import express from 'express';
import subjectsRouter from './routes/subjects.js';
import usersRouter from './routes/users.js';
import classesRouter from './routes/classes.js';
import cors from 'cors';
import securityMiddleware from './middleware/secuirty.js';
import { auth } from './lib/auth.js';
import { toNodeHandler } from 'better-auth/node';
import { isAllowedOrigin } from './config/origins.js';
const app = express();
const PORT = 8000;
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());
app.use(securityMiddleware)

app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/classes',classesRouter);

app.get('/',(req,res)=>{
    res.send("Hello from the Classroom API!");
})
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})