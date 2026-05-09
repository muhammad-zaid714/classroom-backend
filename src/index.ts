import 'dotenv/config';
import express from 'express';
import subjectsRouter from './routes/subjects';
import cors from 'cors';
import securityMiddleware from './middleware/secuirty';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
const app = express();
const PORT = 8000;
const frontendUrl = process.env.FRONTEND_URL;
if(!frontendUrl) throw new Error("FRONTEND_URL is not defined in environment variables");
app.use(cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());
app.use(securityMiddleware)

app.use('/api/subjects', subjectsRouter);

app.get('/',(req,res)=>{
    res.send("Hello from the Classroom API!");
})
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})